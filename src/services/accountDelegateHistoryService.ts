import { isAddress } from "@polkadot/util-crypto";
import { fetchHistorical } from "./fetchService";
import {
	AccountDelegateHistory,
	AccountDelegateHistoryPaginatedResponse,
} from "../model/accountDelegateHistory";
import { ResponseItems } from "../model/itemsConnection";
import { DataError } from "../utils/error";

export async function getAccountDelegateHistory(
	address: string,
	after?: string,
	limit = 100
): Promise<AccountDelegateHistoryPaginatedResponse> {
	if (!isAddress(address)) {
		throw new DataError("Invalid account address");
	}

	const response = await fetchHistorical<{
		delegates: ResponseItems<AccountDelegateHistory>;
	}>(
		`query($after: Cursor, $first: Int!) {
			delegates(after: $after, first: $first, filter: {account: {equalTo: "${address}"}}, orderBy: HEIGHT_ASC) {
				nodes {
					timestamp
					amount
					delegate
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			  }
		}`,
		{
			first: limit,
			after,
		}
	);

	return {
		hasNextPage: response.delegates?.pageInfo.hasNextPage,
		endCursor: response.delegates?.pageInfo.endCursor,
		data: response.delegates?.nodes,
	};
}
