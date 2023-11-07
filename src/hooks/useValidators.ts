import { useState, useCallback, useEffect, useMemo } from "react";
import { fetchHistorical } from "../services/fetchService";
import { getValidators } from "../services/validatorService";
import { ResponseItems } from "../model/itemsConnection";
import { useRollbar } from "@rollbar/react";
import { Validator } from "../model/validator";
import { DataError } from "../utils/error";

type HeightResponse = {
	last: number;
	prev: number;
};

export const useMaxHeightForValidators = () => {
	const [height, setHeight] = useState<HeightResponse>();
	const [loading, setLoading] = useState(false);

	const fetchData = useCallback(async () => {
		if (!height) {
			setLoading(true);

			const res = await fetchHistorical<{
				validators: ResponseItems<{ height: number }>;
			}>(
				`query {
						validators(first: 2, distinct: HEIGHT, orderBy: HEIGHT_DESC) {
							nodes {
								height
							}
						}
					}`
			);

			const nodes = res.validators.nodes;

			if (nodes.length === 2) {
				setHeight({
					last: nodes[0]?.height || 0,
					prev: nodes[1]?.height || 0,
				});
			}

			setLoading(false);
		}
	}, []);

	useEffect(() => {
		setLoading(true);
		fetchData();
	}, [fetchData]);

	return useMemo(() => ({ height, loading }), [height, loading]);
};

export function useValidators(lastHeight?: number, prevHeight?: number) {
	const rollbar = useRollbar();

	const [data, setData] = useState<Validator[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<DataError>();

	const fetchData = useCallback(async (last: number, prev: number) => {
		try {
			const lastValidators = await getValidators(
				{
					height: {
						equalTo: last,
					},
				},
				"AMOUNT_DESC",
				{
					limit: 64,
				}
			);
			const prevValidators = await getValidators(
				{
					height: {
						equalTo: prev,
					},
				},
				"AMOUNT_DESC",
				{
					limit: 64,
				}
			);

			const result: Validator[] = [];
			lastValidators.data.forEach((lastVal) => {
				const prevVal = prevValidators.data.find(
					(prevVal) => prevVal.address === lastVal.address
				);
				if (prevVal) {
					lastVal.amount_day_change = lastVal.amount - prevVal.amount;
					lastVal.nominators_day_change = lastVal.nominators - prevVal.nominators;
				} else {
					lastVal.amount_day_change = lastVal.amount;
					lastVal.nominators_day_change = lastVal.nominators;
				}
				result.push(lastVal);
			});
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
		if (lastHeight && prevHeight) {
			setData([]);
			setError(undefined);
			setLoading(true);
			fetchData(lastHeight, prevHeight);
		}
	}, [fetchData, lastHeight, prevHeight]);

	return {
		loading,
		error,
		data,
	};
}
