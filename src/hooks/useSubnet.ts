import { FetchOptions } from "../model/fetchOptions";
import { SubnetsFilter, getSubnet } from "../services/subnetsService";

import { useResource } from "./useResource";

export function useSubnet(filter: SubnetsFilter, options?: FetchOptions) {
	return useResource(getSubnet, [filter], options);
}
