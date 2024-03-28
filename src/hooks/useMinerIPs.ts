import { useState, useEffect, useCallback } from "react";
import { getMinerIPs } from "../services/subnetsService";

import { useRollbar } from "@rollbar/react";
import { DataError } from "../utils/error";
import {
	MinerIP,
	MinerIPPaginatedResponse,
	MinerIPResponse,
} from "../model/subnet";

export function useMinerIPs(id: string): MinerIPResponse {
	const rollbar = useRollbar();

	const [data, setData] = useState<MinerIP[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<DataError>();

	const fetchData = useCallback(async () => {
		try {
			let finished = false;
			let after: string | undefined = undefined;

			const result: MinerIP[] = [];
			while (!finished) {
				const ips: MinerIPPaginatedResponse = await getMinerIPs(
					{
						netUid: {
							equalTo: parseInt(id),
						},
					},
					"MINERS_COUNT_DESC",
					after
				);
				result.push(...ips.data);
				finished = !ips.hasNextPage;
				after = ips.endCursor;
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
