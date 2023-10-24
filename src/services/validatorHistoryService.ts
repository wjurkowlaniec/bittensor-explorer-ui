import { isAddress } from "@polkadot/util-crypto";
import { fetchHistorical } from "./fetchService";
import {
	ValidatorStakeHistory,
	ValidatorStakeHistoryPaginatedResponse,
} from "../model/validatorHistory";
import { ResponseItems } from "../model/itemsConnection";
import { DataError } from "../utils/error";

export async function getValidatorStakeHistory(
	address: string,
	after?: string,
	limit = 100
): Promise<ValidatorStakeHistoryPaginatedResponse> {
	if (!isAddress(address)) {
		throw new DataError("Invalid account address");
	}

	const response = await fetchHistorical<{
		validators: ResponseItems<ValidatorStakeHistory>;
	}>(
		`query($after: Cursor, $first: Int!) {
			validators(after: $after, first: $first, filter: {address: {equalTo: "${address}"}}, orderBy: HEIGHT_ASC) {
				nodes {
					amount
					nominators
					rank
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
		hasNextPage: response.validators?.pageInfo.hasNextPage,
		endCursor: response.validators?.pageInfo.endCursor,
		data: response.validators?.nodes,
	};
}