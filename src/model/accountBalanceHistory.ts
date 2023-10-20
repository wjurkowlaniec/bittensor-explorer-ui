import { DataError } from "../utils/error";

export type AccountBalanceHistory = {
	balanceFree: bigint;
	balanceStaked: bigint;
	balanceTotal: bigint;
	timestamp: string;
}

export type AccountBalanceHistoryPaginatedResponse = {
	hasNextPage: boolean;
	endCursor: string;
	data: AccountBalanceHistory[];
};

export type AccountBalanceHistoryResponse = {
	loading: boolean;
	error?: DataError;
	data: AccountBalanceHistory[];
};