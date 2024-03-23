/** @jsxImportSource @emotion/react */
import { InfoTable, InfoTableAttribute } from "../InfoTable";
import { Resource } from "../../model/resource";
import { Subnet } from "../../model/subnet";
import { Time } from "../Time";
import { Link } from "../Link";

export type SubnetInfoTableProps = {
	info: Resource<Subnet>;
	additional: any;
};

const SubnetInfoTableAttribute = InfoTableAttribute<any>;

export const SubnetInfoTable = (props: SubnetInfoTableProps) => {
	const { info, additional } = props;

	return (
		<InfoTable
			data={props}
			loading={info.loading}
			notFound={info.notFound}
			notFoundMessage="No subnet found"
			error={info.error}
		>
			<SubnetInfoTableAttribute
				label="Github"
				render={() => <Link to={additional.github}>{additional.github}</Link>}
			/>
			<SubnetInfoTableAttribute
				label="Registered at"
				render={() => (
					<Time time={info?.data?.timestamp || -1} utc timezone={false} />
				)}
			/>
		</InfoTable>
	);
};
