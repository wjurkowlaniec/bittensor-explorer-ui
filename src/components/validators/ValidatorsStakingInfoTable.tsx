/** @jsxImportSource @emotion/react */
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";
import { Validator } from "../../model/validator";
import { NETWORK_CONFIG } from "../../config";
import { AccountAddress } from "../AccountAddress";
import { formatNumber, rawAmountToDecimal } from "../../utils/number";

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
				label={`${NETWORK_CONFIG.currency}/day`}
				render={({ dailyTAO }) => {
					return (
						<>
							{formatNumber(dailyTAO, { decimalPlaces: 4 })}
							{currency}
						</>
					);
				}}
			/>

			<ValidatorsStakingInfoTableAttribute
				label="$/day"
				render={({ dailyUSD }) => {
					return <>${formatNumber(dailyUSD, { decimalPlaces: 2 })}</>;
				}}
			/>

			<ValidatorsStakingInfoTableAttribute
				label={`${NETWORK_CONFIG.currency}/month`}
				render={({ monthlyTAO }) => {
					return (
						<>
							{formatNumber(monthlyTAO, { decimalPlaces: 2 })}
							{currency}
						</>
					);
				}}
			/>

			<ValidatorsStakingInfoTableAttribute
				label="$/month"
				render={({ monthlyUSD }) => {
					return <>${formatNumber(monthlyUSD, { decimalPlaces: 2 })}</>;
				}}
			/>

			<ValidatorsStakingInfoTableAttribute
				label={`${NETWORK_CONFIG.currency}/year`}
				render={({ yearlyTAO }) => {
					return (
						<>
							{formatNumber(yearlyTAO, { decimalPlaces: 2 })}
							{currency}
						</>
					);
				}}
			/>

			<ValidatorsStakingInfoTableAttribute
				label="$/year"
				render={({ yearlyUSD }) => {
					return <>${formatNumber(yearlyUSD, { decimalPlaces: 2 })}</>;
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
								.toFixed(3)}
							{currency}
						</>
					);
				}}
			/>
		</ItemsTable>
	);
}

export default ValidatorsStakingInfoTable;
