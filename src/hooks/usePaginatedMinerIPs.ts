import { FetchOptions } from "../model/fetchOptions";
import { MinerIPOrder, getPaginatedMinerIPs } from "../services/subnetsService";

import { usePaginatedResource } from "./usePaginatedResource";

export function usePaginatedMinerIPs(
	filter: object,
	order?: MinerIPOrder,
	options?: FetchOptions
) {
	return usePaginatedResource(getPaginatedMinerIPs, [filter, order], options);
}
