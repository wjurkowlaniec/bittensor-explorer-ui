import { useState, useCallback, useEffect, useMemo } from "react";
import { FetchOptions } from "../model/fetchOptions";
import { fetchHistorical } from "../services/fetchService";
import {
	ValidatorsFilter,
	ValidatorsOrder,
	getValidators,
} from "../services/validatorService";
import { usePaginatedResource } from "./usePaginatedResource";

export const useMaxHeightForValidators = () => {
	const [maxHeight, setMaxHeight] = useState<number | undefined>();
	const [loading, setLoading] = useState(false);

	const fetchData = useCallback(
		async () => {
			if (!maxHeight) {
				setLoading(true);

				const res = await fetchHistorical<{ validators: { aggregates: { max: { height: number } } } }>(
					`query {
						validators {
							aggregates {
								max {
									height
								}
							}
						}
					}`
				);

				const height = res.validators.aggregates.max.height;

				if (height) {
					setMaxHeight(height);
				}

				setLoading(false);
			}
		}, []
	);

	useEffect(() => {
		setLoading(true);
		fetchData();
	}, [fetchData]);

	return useMemo(() => ({ maxHeight, loading }), [maxHeight, loading]);
};

export function useValidators(
	filter: ValidatorsFilter | undefined,
	order?: ValidatorsOrder,
	options?: FetchOptions
) {
	return usePaginatedResource(getValidators, [filter, order], options);
}
