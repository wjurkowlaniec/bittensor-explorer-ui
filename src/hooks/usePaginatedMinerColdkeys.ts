import { FetchOptions } from "../model/fetchOptions";
import {
	MinerColdkeyOrder,
	getPaginatedMinerColdkeys,
} from "../services/subnetsService";

import { usePaginatedResource } from "./usePaginatedResource";

export function usePaginatedMinerColdkeys(
	filter: object,
	order?: MinerColdkeyOrder,
	options?: FetchOptions
) {
	return usePaginatedResource(
		getPaginatedMinerColdkeys,
		[filter, order],
		options
	);
}
