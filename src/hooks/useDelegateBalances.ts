import { FetchOptions } from "../model/fetchOptions";
import { DelegateBalanceFilter, DelegateBalancesOrder, getDelegateBalances } from "../services/delegateService";
import { usePaginatedResource } from "./usePaginatedResource";

export function useDelegateBalances(
	filter: DelegateBalanceFilter | undefined,
	order?: DelegateBalancesOrder,
	options?: FetchOptions
) {
	return usePaginatedResource(getDelegateBalances, [filter, order], options);
}
