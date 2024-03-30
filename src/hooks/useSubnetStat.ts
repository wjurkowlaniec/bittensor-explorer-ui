import { useEffect } from "react";

import { FetchOptions } from "../model/fetchOptions";
import { USD_RATES_REFRESH_RATE } from "../services/taoPriceService";
import { getSubnetStat } from "../services/subnetsService";

import { useResource } from "./useResource";

export function useSubnetStat(id: string, options?: FetchOptions) {
	const stat = useResource(getSubnetStat, [id], options);

	useEffect(() => {
		if (stat.data) {
			const timeout = setTimeout(stat.refetch, USD_RATES_REFRESH_RATE);
			return () => clearTimeout(timeout);
		}
	}, [stat]);

	return stat;
}
