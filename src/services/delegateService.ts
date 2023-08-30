import { Delegate } from "../model/delegate";
import { ResponseItems } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";

import { extractItems } from "../utils/extractItems";
import { fetchIndexer } from "./fetchService";

export type DelegateFilter = object;
export type DelegatesOrder =
	| "ID_ASC"
	| "ID_DESC"
	| "AMOUNT_ASC"
	| "AMOUNT_DESC"
	| "BLOCK_NUMBER_ASC"
	| "BLOCK_NUMBER_DESC";


export async function getDelegates(
	filter: DelegateFilter | undefined,
	order: DelegatesOrder = "BLOCK_NUMBER_DESC",
	pagination: PaginationOptions,
) {
	return fetchDelegates(filter, order, pagination);
}

/*** PRIVATE ***/

async function fetchDelegates(
	filter: DelegateFilter | undefined,
	order: DelegatesOrder = "BLOCK_NUMBER_DESC",
	pagination: PaginationOptions,
) {
	const offset = pagination.offset;

	const response = await fetchIndexer<{ delegates: ResponseItems<Delegate> }>(
		`query ($first: Int!, $offset: Int!, $filter: DelegateFilter, $order: [DelegatesOrderBy!]!) {
			delegates(first: $first, offset: $offset, filter: $filter, orderBy: $order) {
				nodes {
					id
                    account
                    delegate
                    action
                    amount
                    blockNumber
                    extrinsicId
				}
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
					startCursor
				}
				${(filter != undefined) ? "totalCount" : ""}
			}
		}`,
		{
			first: pagination.limit,
			offset,
			filter,
			order,
		}
	);
	const items = extractItems(response.delegates, pagination, (x) => x);

	return items;
}