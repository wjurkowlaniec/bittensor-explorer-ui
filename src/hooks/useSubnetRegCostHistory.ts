import { useState, useEffect, useCallback } from "react";
import { getSubnetRegCostHistory } from "../services/subnetsService";

import { useRollbar } from "@rollbar/react";
import { DataError } from "../utils/error";
import {
	SubnetRegCostHistory,
	SubnetRegCostHistoryPaginatedResponse,
	SubnetRegCostHistoryResponse,
} from "../model/subnet";

export function useSubnetRegCostHistory(): SubnetRegCostHistoryResponse {
	const rollbar = useRollbar();

	const [data, setData] = useState<SubnetRegCostHistory[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<DataError>();

	const fetchData = useCallback(async () => {
		try {
			let finished = false;
			let after: string | undefined = undefined;

			const result: SubnetRegCostHistory[] = [];
			while (!finished) {
				const regCost: SubnetRegCostHistoryPaginatedResponse =
					await getSubnetRegCostHistory(undefined, "HEIGHT_ASC", after);
				result.push(...regCost.data);
				finished = !regCost.hasNextPage;
				after = regCost.endCursor;
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
