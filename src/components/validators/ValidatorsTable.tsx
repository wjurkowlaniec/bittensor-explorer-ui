import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";
import { Validator } from "../../model/validator";
import { NETWORK_CONFIG } from "../../config";
import { AccountAddress } from "../AccountAddress";
import { Currency } from "../Currency";
import { DataError } from "../../utils/error";

export type ValidatorsTableProps = {
	validators: {
		loading: boolean;
		error?: DataError;
		data: Validator[];
	};
};

const ValidatorsTableAttribute = ItemsTableAttribute<Validator>;

function ValidatorsTable(props: ValidatorsTableProps) {
	const { validators } = props;

	const { currency, prefix } = NETWORK_CONFIG;

	return (
		<ItemsTable
			data={validators.data}
			loading={validators.loading}
			notFoundMessage="No validators found"
			error={validators.error}
			data-test="validators-table"
		>
			<ValidatorsTableAttribute
				label="Rank"
				render={(validator) => <>{validator.rank}</>}
			/>
			<ValidatorsTableAttribute
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
						<Link to={`/validators/${validator.address}`}>
							{validator.name}
						</Link>
					)
				}
			/>
			<ValidatorsTableAttribute
				label="Stake"
				render={(validator) => {
					const change24h = validator.amount_day_change || BigInt("0");
					return (
						<>
							<Currency
								amount={validator.amount}
								currency={currency}
								decimalPlaces="optimal"
								showFullInTooltip
							/>
							{change24h != BigInt("0") && (
								<span className={`${change24h > 0 ? "up" : "down"}`}>
									{" ("}
									{change24h > 0 ? "▴" : "▾"}
									<Currency
										amount={change24h}
										currency={currency}
										decimalPlaces="optimal"
										showFullInTooltip
									/>
									{")"}
								</span>
							)}
						</>
					);
				}}
			/>
			<ValidatorsTableAttribute
				label="Nominators"
				render={(validator) => {
					const change24h = validator.nominators_day_change || BigInt("0");
					return (
						<>
							{validator.nominators}
							{change24h != BigInt("0") && (
								<span className={`${change24h > 0 ? "up" : "down"}`}>
									{" ("}
									{change24h > 0 ? "▴" : "▾"}
									<>{change24h.toString()}</>
									{")"}
								</span>
							)}
						</>
					);
				}}
			/>
			<ValidatorsTableAttribute
				label="Last update"
				render={(validator) => validator.timestamp}
			/>
		</ItemsTable>
	);
}

export default ValidatorsTable;
