import { useState, useEffect, useCallback } from "react";
import { getNeuronDeregistration } from "../services/subnetsService";

import { useRollbar } from "@rollbar/react";
import { DataError } from "../utils/error";
import {
	NeuronDeregistration,
	NeuronDeregistrationPaginatedResponse,
	NeuronDeregistrationResponse,
} from "../model/subnet";

export function useNeuronDeregistrations(
	id: string
): NeuronDeregistrationResponse {
	const rollbar = useRollbar();

	const [data, setData] = useState<NeuronDeregistration[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<DataError>();

	const fetchData = useCallback(async () => {
		try {
			let finished = false;
			let after: string | undefined = undefined;

			const now = Date.now();
			const from = new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString();

			const result: NeuronDeregistration[] = [];
			while (!finished) {
				const deregistration: NeuronDeregistrationPaginatedResponse =
					await getNeuronDeregistration(
						{
							netUid: {
								equalTo: parseInt(id),
							},
							timestamp: {
								greaterThan: new Date(from).toISOString().substring(0, 19),
							},
						},
						"HEIGHT_ASC",
						after
					);
				result.push(...deregistration.data);
				finished = !deregistration.hasNextPage;
				after = deregistration.endCursor;
			}
			setData(result);
		} catch (e) {
			if (e instanceof DataError) {
				rollbar.error(e);
				setError(e);
			} else {
				throw e;
			}
		}

		setLoading(false);
	}, []);

	useEffect(() => {
		setData([]);
		setError(undefined);
		setLoading(true);
		fetchData();
	}, [fetchData]);

	return {
		loading,
		error,
		data,
	};
}
