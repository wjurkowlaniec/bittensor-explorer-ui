import { useState, useEffect, useCallback } from "react";
import { useRollbar } from "@rollbar/react";

import { getValidatorsMovingAverage } from "../services/validatorService";
import { DataError } from "../utils/error";
import {
	ValidatorMovingAverage,
	ValidatorMovingAverageResponse,
} from "../model/validator";

export function useValidatorMovingAverage(
	addresses: string[]
): ValidatorMovingAverageResponse {
	const rollbar = useRollbar();

	const [data, setData] = useState<ValidatorMovingAverage[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<DataError>();

	const fetchData = useCallback(async (addrs: string[]) => {
		try {
			const movingAvg = await getValidatorsMovingAverage(
				{ address: { in: addrs } },
				"HEIGHT_DESC",
				undefined,
				addrs.length
			);
			setData(movingAvg.data);
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
		setError(undefined);
		setLoading(true);
		fetchData(addresses);
	}, [fetchData, addresses.length]);

	return {
		loading,
		error,
		data,
	};
}
