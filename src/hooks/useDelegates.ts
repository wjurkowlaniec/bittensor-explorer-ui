import { FetchOptions } from "../model/fetchOptions";
import { DelegateFilter, DelegatesOrder, getDelegates } from "../services/delegateService";
import { usePaginatedResource } from "./usePaginatedResource";

export function useDelegates(
	filter: DelegateFilter | undefined,
	order?: DelegatesOrder,
	options?: FetchOptions
) {
	return usePaginatedResource(getDelegates, [filter, order], options);
}
