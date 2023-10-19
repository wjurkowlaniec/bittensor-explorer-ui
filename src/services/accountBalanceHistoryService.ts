import { isAddress } from "@polkadot/util-crypto";
import { fetchHistorical } from "./fetchService";
import {
	AccountBalanceHistory,
	AccountBalanceHistoryPaginatedResponse,
} from "../model/accountBalanceHistory";
import { ResponseItems } from "../model/itemsConnection";
import { DataError } from "../utils/error";

export async function getAccountBalanceHistory(
	address: string,
	after?: string,
	limit = 100
): Promise<AccountBalanceHistoryPaginatedResponse> {
	if (!isAddress(address)) {
		throw new DataError("Invalid account address");
	}

	const response = await fetchHistorical<{
		accountBalances: ResponseItems<AccountBalanceHistory>;
	}>(
		`query($after: Cursor, $first: Int!) {
			accountBalances(after: $after, first: $first, filter: {address: {equalTo: "${address}"}}, orderBy: HEIGHT_ASC) {
				nodes {
					height
					balanceFree
					balanceStaked
					balanceTotal
					timestamp
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
		hasNextPage: response.accountBalances?.pageInfo.hasNextPage,
		endCursor: response.accountBalances?.pageInfo.endCursor,
		data: response.accountBalances?.nodes,
	};
}
