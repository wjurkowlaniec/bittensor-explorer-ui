/** @jsxImportSource @emotion/react */
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";
import { Validator } from "../../model/validator";
import { NETWORK_CONFIG } from "../../config";
import { AccountAddress } from "../AccountAddress";
import { rawAmountToDecimal } from "../../utils/number";

export type ValidatorsStakingInfoTableProps = {
	validators: any[];
	selected: Validator | undefined;
};

const ValidatorsStakingInfoTableAttribute = ItemsTableAttribute<any>;

function ValidatorsStakingInfoTable(props: ValidatorsStakingInfoTableProps) {
	const { validators, selected } = props;

	const { currency, prefix } = NETWORK_CONFIG;

	return (
		<ItemsTable
			data={validators}
			notFoundMessage="No validators found"
			data-test="validators-table"
			showRank
			active={selected?.id}
		>
			<ValidatorsStakingInfoTableAttribute
				label="Validator"
				render={(validator) =>
					validator.name === undefined ? (
						<AccountAddress
							address={validator.address}
							prefix={prefix}
							shorten
							delegate
							copyToClipboard="small"
						/>
					) : (
						<Link to={`/validator/${validator.address}`}>{validator.name}</Link>
					)
				}
			/>

			<ValidatorsStakingInfoTableAttribute
				label="Daily"
				align="right"
				render={({ dailyTAO }) => {
					return (
						<>
							{dailyTAO.toFixed(2)}
							{currency}
						</>
					);
				}}
			/>

			<ValidatorsStakingInfoTableAttribute
				label=""
				render={({ dailyUSD }) => {
					return <>${dailyUSD.toFixed(2)}</>;
				}}
			/>

			<ValidatorsStakingInfoTableAttribute
				label="Monthly"
				align="right"
				render={({ monthlyTAO }) => {
					return (
						<>
							{monthlyTAO.toFixed(2)}
							{currency}
						</>
					);
				}}
			/>

			<ValidatorsStakingInfoTableAttribute
				label=""
				render={({ monthlyUSD }) => {
					return <>${monthlyUSD.toFixed(2)}</>;
				}}
			/>

			<ValidatorsStakingInfoTableAttribute
				label="Yearly"
				align="right"
				render={({ yearlyTAO }) => {
					return (
						<>
							{yearlyTAO.toFixed(2)}
							{currency}
						</>
					);
				}}
			/>

			<ValidatorsStakingInfoTableAttribute
				label=""
				render={({ yearlyUSD }) => {
					return <>${yearlyUSD.toFixed(2)}</>;
				}}
			/>

			<ValidatorsStakingInfoTableAttribute
				label="APR"
				align="right"
				render={({ apr }) => {
					return <>{apr.toFixed(2)}%</>;
				}}
			/>

			<ValidatorsStakingInfoTableAttribute
				label={`NOM. / 24h / k${currency}`}
				align="right"
				render={({ norm30DayAvg }) => {
					return (
						<>
							{rawAmountToDecimal(norm30DayAvg?.toString())
								.toNumber()
								.toFixed(2)}
							{currency}
						</>
					);
				}}
			/>
		</ItemsTable>
	);
}

export default ValidatorsStakingInfoTable;
