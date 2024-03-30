import { FetchOptions } from "../model/fetchOptions";
import {
	SingleSubnetStatsFilter,
	getSingleSubnetStat,
} from "../services/subnetsService";

import { useResource } from "./useResource";

export function useSingleSubnetStat(
	filter: SingleSubnetStatsFilter,
	options?: FetchOptions
) {
	return useResource(getSingleSubnetStat, [filter], options);
}
