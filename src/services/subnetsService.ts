import {
	Subnet,
	SubnetHistory,
	SubnetOwner,
	SubnetHistoryPaginatedResponse,
	SubnetOwnerPaginatedResponse,
	SubnetRegCostHistory,
	SubnetRegCostHistoryPaginatedResponse,
	SubnetStat,
	NeuronRegCostHistory,
	NeuronRegCostHistoryPaginatedResponse,
	NeuronMetagraph,
	SingleSubnetStat,
} from "../model/subnet";
import { ResponseItems } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";
import subnetsJson from "../subnets.json";
import { extractItems } from "../utils/extractItems";
import { fetchIndexer, fetchSubnets } from "./fetchService";

export type SubnetsFilter = object;
export type SingleSubnetStatsFilter = object;
export type NeuronMetagraphFilter = object;

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

export type NeuronHistoryOrder =
	| "ID_ASC"
	| "ID_DESC"
	| "HEIGHT_ASC"
	| "HEIGHT_DESC";

export type SubnetOwnerOrder =
	| "ID_ASC"
	| "ID_DESC"
	| "HEIGHT_ASC"
	| "HEIGHT_DESC";

export type NeuronMetagraphOrder =
	| "ACTIVE_ASC"
	| "ACTIVE_DESC"
	| "AXON_IP_ASC"
	| "AXON_IP_DESC"
	| "AXON_PORT_ASC"
	| "AXON_PORT_DESC"
	| "COLDKEY_ASC"
	| "COLDKEY_DESC"
	| "CONSENSUS_ASC"
	| "CONSENSUS_DESC"
	| "DAILY_REWARD_ASC"
	| "DAILY_REWARD_DESC"
	| "DIVIDENDS_ASC"
	| "DIVIDENDS_DESC"
	| "EMISSION_ASC"
	| "EMISSION_DESC"
	| "HOTKEY_ASC"
	| "HOTKEY_DESC"
	| "ID_ASC"
	| "ID_DESC"
	| "INCENTIVE_ASC"
	| "INCENTIVE_DESC"
	| "LAST_UPDATE_ASC"
	| "LAST_UPDATE_DESC"
	| "NET_UID_ASC"
	| "NET_UID_DESC"
	| "PRIMARY_KEY_ASC"
	| "PRIMARY_KEY_DESC"
	| "RANK_ASC"
	| "RANK_DESC"
	| "STAKE_ASC"
	| "STAKE_DESC"
	| "TOTAL_REWARD_ASC"
	| "TOTAL_REWARD_DESC"
	| "TRUST_ASC"
	| "TRUST_DESC"
	| "UID_ASC"
	| "UID_DESC"
	| "VALIDATOR_PERMIT_ASC"
	| "VALIDATOR_PERMIT_DESC"
	| "VALIDATOR_TRUST_ASC"
	| "VALIDATOR_TRUST_DESC";

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
		subnetRegHistoricals: ResponseItems<SubnetRegCostHistory>;
	}>(
		`query($filter: SubnetRegHistoricalFilter, $order: [SubnetRegHistoricalsOrderBy!]!, $after: Cursor, $first: Int!) {
			subnetRegHistoricals(filter: $filter, orderBy: $order, after: $after, first: $first) {
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
		hasNextPage: response.subnetRegHistoricals?.pageInfo.hasNextPage,
		endCursor: response.subnetRegHistoricals?.pageInfo.endCursor,
		data: response.subnetRegHistoricals?.nodes,
	};
}

export async function getNeuronRegCostHistory(
	filter?: object,
	order: NeuronHistoryOrder = "ID_ASC",
	after?: string,
	limit = 100
): Promise<NeuronRegCostHistoryPaginatedResponse> {
	const response = await fetchSubnets<{
		neuronRegHistoricals: ResponseItems<NeuronRegCostHistory>;
	}>(
		`query($filter: NeuronRegHistoricalFilter, $order: [NeuronRegHistoricalsOrderBy!]!, $after: Cursor, $first: Int!) {
			neuronRegHistoricals(filter: $filter, orderBy: $order, after: $after, first: $first) {
				nodes {
					id
					height
					regCost
					timestamp
					netUid
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
		hasNextPage: response.neuronRegHistoricals?.pageInfo.hasNextPage,
		endCursor: response.neuronRegHistoricals?.pageInfo.endCursor,
		data: response.neuronRegHistoricals?.nodes,
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

export async function getNeuronMetagraph(
	filter: NeuronMetagraphFilter | undefined,
	order: NeuronMetagraphOrder = "ID_DESC",
	pagination: PaginationOptions
) {
	const response = await fetchSubnets<{
		neuronInfos: ResponseItems<NeuronMetagraph>;
	}>(
		`query ($first: Int!, $after: Cursor, $filter: NeuronInfoFilter, $order: [NeuronInfosOrderBy!]!) {
			neuronInfos(first: $first, after: $after, filter: $filter, orderBy: $order) {
				nodes {
					id
					active
					axonIp
					axonPort
					coldkey
					consensus
					dailyReward
					dividends
					emission
					hotkey
					incentive
					lastUpdate
					netUid
					rank
					stake
					totalReward
					uid
					trust
					validatorPermit
					validatorTrust
				}
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
				}
				${pagination.after === undefined ? "totalCount" : ""}
			}
		}`,
		{
			after: pagination.after,
			first: pagination.limit,
			filter,
			order,
		}
	);

	return extractItems(response.neuronInfos, pagination, transformMetagraph);
}

export async function getSingleSubnetStat(
	filter: SingleSubnetStatsFilter | undefined
) {
	const response = await fetchSubnets<{
		singleSubnetStats: ResponseItems<SingleSubnetStat>;
	}>(
		`query ($filter: SingleSubnetStatFilter) {
			singleSubnetStats(first: 1, offset: 0, filter: $filter, orderBy: ID_DESC) {
				nodes {
					id
					activeDual
					activeKeys
					activeMiners
					activeValidators
					maxNeurons
					netUid
					regCost
					validators
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
		response.singleSubnetStats,
		{ limit: 1 },
		transformSingleSubnetStat
	);

	return data.data[0];
}

function addSubnetName<T extends { netUid: number; name?: string }>(
	subnet: T,
	subnetNames: Record<string, Record<string, string>>
): T {
	const name = subnetNames[subnet.netUid]?.name || "Unknown";
	return { ...subnet, name } as T;
}

const transformMetagraph = (metagraph: NeuronMetagraph): NeuronMetagraph => {
	return metagraph;
};

const transformSingleSubnetStat = (
	stat: SingleSubnetStat
): SingleSubnetStat => {
	return stat;
};
