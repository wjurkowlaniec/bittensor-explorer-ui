export type DelegateAction = "DELEGATE" | "UNDELEGATE";

export type Delegate = {
	id: string;
	account: string;
	delegate: string;
	amount: bigint;
	blockNumber: bigint;
	extrinsicId: number;
	action: DelegateAction;
};

export type DelegateBalance = {
	id: string;
	account: string;
	delegate: string;
	amount: bigint;
	updatedAt: bigint;
};

export type DelegateInfo = {
	hotkey: string;
	name: string;
	url: string;
	description: string;
	signature: string;
}
