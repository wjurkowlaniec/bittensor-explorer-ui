import { useState, useEffect, useCallback } from "react";
import { getSubnetOwners } from "../services/subnetsService";

import { useRollbar } from "@rollbar/react";
import { DataError } from "../utils/error";
import {
	SubnetOwner,
	SubnetOwnerPaginatedResponse,
	SubnetOwnerResponse,
} from "../model/subnet";

export function useSubnetOwners(subnetId: string): SubnetOwnerResponse {
	const rollbar = useRollbar();

	const [data, setData] = useState<SubnetOwner[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<DataError>();

	const fetchData = useCallback(async () => {
		try {
			const limit = 100;

			let finished = false;
			let after: string | undefined = undefined;

			const result: SubnetOwner[] = [];
			while (!finished) {
				const stats: SubnetOwnerPaginatedResponse = await getSubnetOwners(
					{
						netid: {
							equalTo: parseInt(subnetId),
						},
					},
					"HEIGHT_ASC",
					after,
					limit
				);
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
		ids: [],
	};
}
