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
