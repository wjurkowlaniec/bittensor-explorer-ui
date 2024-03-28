import { useState, useEffect, useCallback } from "react";
import { getMinerIncentive } from "../services/subnetsService";

import { useRollbar } from "@rollbar/react";
import { DataError } from "../utils/error";
import {
	MinerIncentive,
	MinerIncentivePaginatedResponse,
	MinerIncentiveResponse,
} from "../model/subnet";

export function useMinerIncentive(id: string): MinerIncentiveResponse {
	const rollbar = useRollbar();

	const [data, setData] = useState<MinerIncentive[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<DataError>();

	const fetchData = useCallback(async () => {
		try {
			let finished = false;
			let after: string | undefined = undefined;

			const result: MinerIncentive[] = [];
			while (!finished) {
				const incentive: MinerIncentivePaginatedResponse =
					await getMinerIncentive(
						{
							netUid: {
								equalTo: parseInt(id),
							},
						},
						"INCENTIVE_ASC",
						after
					);
				result.push(...incentive.data);
				finished = !incentive.hasNextPage;
				after = incentive.endCursor;
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
