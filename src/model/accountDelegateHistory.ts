import { DataError } from "../utils/error";

export type AccountDelegateHistory = {
	amount: bigint;
	delegate: string;
	height: bigint;
	timestamp: string;
}

export type AccountDelegateHistoryPaginatedResponse = {
	hasNextPage: boolean;
	endCursor: string;
	data: AccountDelegateHistory[];
};

export type AccountDelegateHistoryResponse = {
	loading: boolean;
	error?: DataError;
	data: AccountDelegateHistory[];
};