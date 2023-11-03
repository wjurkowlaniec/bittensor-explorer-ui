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
				label="Hotkey"
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
				render={(validator) => (
					<Currency
						amount={validator.amount}
						currency={currency}
						decimalPlaces="optimal"
						showFullInTooltip
					/>
				)}
			/>
			<ValidatorsTableAttribute
				label={"24h Change"}
				render={(validator) => {
					const change24h = validator.day_change || BigInt("0");
					return (
						<span
							className={`${
								change24h > 0 ? "up" : change24h < 0 ? "down" : ""
							}`}
						>
							{change24h > 0 ? "▴" : change24h < 0 ? "▾" : ""}
							<Currency
								amount={change24h}
								currency={currency}
								decimalPlaces="optimal"
								showFullInTooltip
							/>
						</span>
					);
				}}
			/>
			<ValidatorsTableAttribute
				label="Nominators"
				render={(validator) => <>{validator.nominators}</>}
			/>
		</ItemsTable>
	);
}

export default ValidatorsTable;
