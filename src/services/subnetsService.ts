import {
	Subnet,
	SubnetHistory,
	SubnetOwner,
	SubnetHistoryPaginatedResponse,
	SubnetOwnerPaginatedResponse,
	SubnetRegCostHistory,
	SubnetRegCostHistoryPaginatedResponse,
	SubnetStat,
} from "../model/subnet";
import { ResponseItems } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";
import subnetsJson from "../subnets.json";
import { extractItems } from "../utils/extractItems";
import { fetchIndexer, fetchSubnets } from "./fetchService";

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
	| "TIMESTAMP_ASC"
	| "TIMESTAMP_DESC";

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
	const response = await fetchSubnets<{ subnets: ResponseItems<Subnet> }>(
		`query ($filter: SubnetFilter) {
			subnets(first: 1, offset: 0, filter: $filter, orderBy: ID_DESC) {
				nodes {
					id
					netUid
					owner
					extrinsicId
					emission
					recycled24H
					recycledAtCreation
					recycledByOwner
					recycledLifetime
					regCost
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
	after?: string,
	limit = 100
): Promise<SubnetHistoryPaginatedResponse> {
	const response = await fetchSubnets<{
		subnetHistoricals: ResponseItems<SubnetHistory>;
	}>(
		`query($filter: SubnetHistoricalFilter, $order: [SubnetHistoricalsOrderBy!]!, $after: Cursor, $first: Int!) {
			subnetHistoricals(filter: $filter, orderBy: $order, after: $after, first: $first) {
				nodes {
					id
					netUid
					height
					emission
					recycled
					recycled24H
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
		}
	);

	return {
		hasNextPage: response.subnetHistoricals?.pageInfo.hasNextPage,
		endCursor: response.subnetHistoricals?.pageInfo.endCursor,
		data: response.subnetHistoricals?.nodes,
	};
}

export async function getSubnetRegCostHistory(
	filter?: object,
	order: SubnetHistoryOrder = "ID_ASC",
	after?: string,
	limit = 100
): Promise<SubnetRegCostHistoryPaginatedResponse> {
	const response = await fetchSubnets<{
		registrationHistoricals: ResponseItems<SubnetRegCostHistory>;
	}>(
		`query($filter: RegistrationHistoricalFilter, $order: [RegistrationHistoricalsOrderBy!]!, $after: Cursor, $first: Int!) {
			registrationHistoricals(filter: $filter, orderBy: $order, after: $after, first: $first) {
				nodes {
					id
					height
					regCost
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
		}
	);

	return {
		hasNextPage: response.registrationHistoricals?.pageInfo.hasNextPage,
		endCursor: response.registrationHistoricals?.pageInfo.endCursor,
		data: response.registrationHistoricals?.nodes,
	};
}

export async function getSubnetOwners(
	filter?: object,
	order: SubnetOwnerOrder = "ID_ASC",
	after?: string,
	limit = 100
): Promise<SubnetOwnerPaginatedResponse> {
	const response = await fetchIndexer<{
		subnetOwners: ResponseItems<SubnetOwner>;
	}>(
		`query($filter: SubnetOwnerFilter, $order: [SubnetOwnersOrderBy!]!, $after: Cursor, $first: Int!) {
			subnetOwners(filter: $filter, orderBy: $order, after: $after, first: $first) {
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
		}
	);

	return {
		hasNextPage: response.subnetOwners?.pageInfo.hasNextPage,
		endCursor: response.subnetOwners?.pageInfo.endCursor,
		data: response.subnetOwners?.nodes,
	};
}

export async function getSubnetStat(id: string) {
	const response = await fetchSubnets<{ subnetStat: SubnetStat }>(
		`query ($id: String!) {
			subnetStat(id: $id) {
				height
				id
				regCost
				timestamp
			}
		}`,
		{
			id,
		}
	);

	return response.subnetStat;
}

function addSubnetName<T extends { netUid: number; name?: string }>(
	subnet: T,
	subnetNames: Record<string, Record<string, string>>
): T {
	const name = subnetNames[subnet.netUid]?.name || "Unknown";
	return { ...subnet, name } as T;
}
