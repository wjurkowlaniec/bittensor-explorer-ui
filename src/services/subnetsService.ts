import {
	Subnet,
	SubnetHistory,
	SubnetOwner,
	SubnetHistoryPaginatedResponse,
	SubnetOwnerPaginatedResponse,
} from "../model/subnet";
import { ResponseItems } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";
import subnetsJson from "../subnets.json";
import { extractItems } from "../utils/extractItems";
import { fetchHistorical, fetchIndexer } from "./fetchService";

export type SubnetsFilter = object;

export type SubnetsOrder =
	| "ID_ASC"
	| "ID_DESC"
	| "NET_UID_ASC"
	| "NET_UID_DESC"
	| "EMISSION_ASC"
	| "EMISSION_DESC"
	| "RAO_RECYCLED_ASC"
	| "RAO_RECYCLED_DESC"
	| "RAO_RECYCLED24H_ASC"
	| "RAO_RECYCLED24H_DESC"
	| "CREATED_AT_ASC"
	| "CREATED_AT_DESC";

export type SubnetHistoryOrder =
	| "ID_ASC"
	| "ID_DESC"
	| "HEIGHT_ASC"
	| "HEIGHT_DESC";

export type SubnetOwnerOrder =
	| "ID_ASC"
	| "ID_DESC"
	| "HEIGHT_ASC"
	| "HEIGHT_DESC";

export async function getSubnet(filter: SubnetsFilter | undefined) {
	const response = await fetchIndexer<{ subnets: ResponseItems<Subnet> }>(
		`query ($filter: SubnetFilter) {
			subnets(first: 1, offset: 0, filter: $filter, orderBy: ID_DESC) {
				nodes {
					id
					netUid
					createdAt
					owner
					extrinsicId
					emission
					recycled24H
					recycledAtCreation
					recycledByOwner
					recycledLifetime
					timestamp
				}
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
				}
				totalCount
			}
		}`,
		{
			filter,
		}
	);

	const data = extractItems(
		response.subnets,
		{ limit: 1 },
		addSubnetName,
		subnetsJson
	);

	return data.data[0];
}

export async function getSubnets(
	filter: SubnetsFilter | undefined,
	order: SubnetsOrder = "NET_UID_ASC",
	pagination: PaginationOptions
) {
	const response = await fetchIndexer<{ subnets: ResponseItems<Subnet> }>(
		`query ($filter: SubnetFilter, $order: [SubnetsOrderBy!]!) {
			subnets(filter: $filter, orderBy: $order) {
				nodes {
					id
					netUid
					createdAt
					owner
					extrinsicId
					emission
					recycled24H
					recycledAtCreation
					recycledByOwner
					recycledLifetime
					timestamp
				}
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
				}
				totalCount
			}
		}`,
		{
			filter,
			order,
		}
	);

	return extractItems(response.subnets, pagination, addSubnetName, subnetsJson);
}

export async function getSubnetHistory(
	filter?: object,
	order: SubnetHistoryOrder = "ID_ASC",
	distinct?: string,
	after?: string,
	limit = 100
): Promise<SubnetHistoryPaginatedResponse> {
	const response = await fetchHistorical<{
		subnets: ResponseItems<SubnetHistory>;
	}>(
		`query($filter: SubnetFilter, $order: [SubnetsOrderBy!]!, $distinct: [subnets_distinct_enum], $after: Cursor, $first: Int!) {
			subnets(filter: $filter, orderBy: $order, distinct: $distinct, after: $after, first: $first) {
				nodes {
					id
					subnetId
					height
					emission
					raoRecycled
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
			filter,
			order,
			distinct,
		}
	);

	return {
		hasNextPage: response.subnets?.pageInfo.hasNextPage,
		endCursor: response.subnets?.pageInfo.endCursor,
		data: response.subnets?.nodes,
	};
}

export async function getSubnetOwners(
	filter?: object,
	order: SubnetOwnerOrder = "ID_ASC",
	distinct?: string,
	after?: string,
	limit = 100
): Promise<SubnetOwnerPaginatedResponse> {
	const response = await fetchIndexer<{
		subnetOwners: ResponseItems<SubnetOwner>;
	}>(
		`query($filter: SubnetOwnerFilter, $order: [SubnetOwnersOrderBy!]!, $distinct: [subnet_owners_distinct_enum], $after: Cursor, $first: Int!) {
			subnetOwners(filter: $filter, orderBy: $order, distinct: $distinct, after: $after, first: $first) {
				nodes {
					id
					netid
					height
					owner
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
			filter,
			order,
			distinct,
		}
	);

	return {
		hasNextPage: response.subnetOwners?.pageInfo.hasNextPage,
		endCursor: response.subnetOwners?.pageInfo.endCursor,
		data: response.subnetOwners?.nodes,
	};
}

function addSubnetName<T extends { netUid: number; name?: string }>(
	subnet: T,
	subnetNames: Record<string, Record<string, string>>
): T {
	const name = subnetNames[subnet.netUid]?.name || "Unknown";
	return { ...subnet, name } as T;
}
