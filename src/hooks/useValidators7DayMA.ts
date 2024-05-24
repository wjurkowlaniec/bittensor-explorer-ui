import { useState, useEffect, useCallback } from "react";
import { useRollbar } from "@rollbar/react";

import { getValidator7DayMA } from "../services/validatorService";
import { DataError } from "../utils/error";
import {
	Validator7DayMA,
	Validator7DayMAPaginatedResponse,
	Validator7DayMAResponse,
} from "../model/validator";

export function useValidator7DayMA(address: string): Validator7DayMAResponse {
	const rollbar = useRollbar();

	const [data, setData] = useState<Validator7DayMA[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<DataError>();

	const fetchData = useCallback(async () => {
		try {
			let finished = false;
			let after: string | undefined = undefined;

			const result: Validator7DayMA[] = [];
			while (!finished) {
				const stats: Validator7DayMAPaginatedResponse =
					await getValidator7DayMA({ address: { equalTo: address } }, after);
				result.push(...stats.data);
				finished = !stats.hasNextPage;
				after = stats.endCursor;
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
