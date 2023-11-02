import { useEffect, useState } from "react";
import { PaginatedResource } from "../../model/paginatedResource";
import { SortOrder } from "../../model/sortOrder";
import { SortDirection } from "../../model/sortDirection";
import { ItemsTable, ItemsTableAttribute } from "../ItemsTable";
import { Link } from "../Link";
import { Validator } from "../../model/validator";
import { ValidatorsOrder } from "../../services/validatorService";
import { NETWORK_CONFIG } from "../../config";
import { AccountAddress } from "../AccountAddress";
import { Currency } from "../Currency";

export type ValidatorsTableProps = {
	validators: PaginatedResource<Validator>,
	initialSortOrder?: string;
	onSortChange?: (orderBy: ValidatorsOrder) => void;
	initialSort?: string;
};

const ValidatorsTableAttribute = ItemsTableAttribute<Validator>;

const orderMappings = {
	amount: {
		[SortDirection.ASC]: "AMOUNT_ASC",
		[SortDirection.DESC]: "AMOUNT_DESC",
	},
	nominators: {
		[SortDirection.ASC]: "NOMINATORS_ASC",
		[SortDirection.DESC]: "NOMINATORS_DESC",
	},
};

function ValidatorsTable(props: ValidatorsTableProps) {
	const {
		validators,
	} = props;

	const { currency, prefix } = NETWORK_CONFIG;

	const { initialSort, onSortChange } = props;
	const [sort, setSort] = useState<SortOrder<string>>();

	useEffect(() => {
		Object.entries(orderMappings).forEach(([property, value]) => {
			Object.entries(value).forEach(([dir, orderKey]) => {
				if (orderKey === initialSort) {
					setSort({
						property,
						direction: dir === "1" ? SortDirection.ASC : SortDirection.DESC,
					});
				}
			});
		});
	}, [initialSort]);

	const handleSortChange = (property?: string) => {
		if (!property) return;
		if (property === sort?.property) {
			setSort({
				...sort,
				direction: sort.direction === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC,
			});
		} else {
			setSort({
				property,
				direction: SortDirection.DESC,
			});
		}
	};

	useEffect(() => {
		if (!onSortChange || !sort?.property || sort.direction === undefined)
			return;
		onSortChange((orderMappings as any)[sort.property][sort.direction]);
	}, [JSON.stringify(sort)]);

	return (
		<ItemsTable
			data={validators.data}
			loading={validators.loading}
			notFound={validators.notFound}
			notFoundMessage="No validators found"
			error={validators.error}
			pagination={validators.pagination}
			data-test="validators-table"
			sort={sort}
			onSortChange={handleSortChange}
			showRank
		>
			<ValidatorsTableAttribute
				label="Hotkey"
				render={(validator) =>
					validator.name === undefined ?
						<AccountAddress
							address={validator.address}
							prefix={prefix}
							shorten
							delegate
							copyToClipboard='small'
						/> :
						<Link to={ `/validators/${validator.address}`}>
							{validator.name}
						</Link>
				}
			/>
			<ValidatorsTableAttribute
				label="Dominance"
				render={(validator) => (
					<Currency
						amount={validator.amount}
						currency={currency}
						decimalPlaces='optimal'
						showFullInTooltip
					/>
				)}
				sortable
				sortProperty='amount'
			/>
			<ValidatorsTableAttribute
				label="Nominators"
				sortable
				render={(validator) =>
					<>{validator.nominators}</>
				}
				sortProperty='nominators'
			/>
		</ItemsTable>
	);
}

export default ValidatorsTable;
