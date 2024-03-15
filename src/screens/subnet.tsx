/** @jsxImportSource @emotion/react */
import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";
import { Card, CardHeader } from "../components/Card";
import { useSubnetHistory } from "../hooks/useSubnetHistory";
import { useLocation, useParams } from "react-router-dom";
import { Theme, css } from "@emotion/react";
import { SubnetInfoTable } from "../components/subnets/SubnetInfoTable";
import subnetsJson from "../subnets.json";
import { useSubnet } from "../hooks/useSubnet";
import { SubnetTaoRecycledHistoryChart } from "../components/subnets/SubnetTaoRecycledHistoryChart";
import { useSubnetOwners } from "../hooks/useSubnetOwners";
import SubnetOwnersTable from "../components/subnets/SubnetOwnersTable";
import { useEffect } from "react";
import { TabbedContent, TabPane } from "../components/TabbedContent";
import { SubnetTaoRecycled24HHistoryChart } from "../components/subnets/SubnetTaoRecycled24HHistoryChart";
import Spinner from "../components/Spinner";
import { formatNumber, rawAmountToDecimal } from "../utils/number";
import { NETWORK_CONFIG } from "../config";
import { useNeuronRegCostHistory } from "../hooks/useNeuronRegCostHistory";
import { NeuronRegistrationChart } from "../components/subnets/NeuronRegistrationChart";

const subnetHeader = (theme: Theme) => css`
	display: flex;
	flex-wrap: wrap;
	gap: 4px;
	align-items: center;
	word-break: keep-all;
	color: ${theme.palette.text.primary};
`;

const subnetTitle = css`
	display: block;
	opacity: 0.8;
	width: 144px;
	font-size: 12px;
`;

const subnetName = css`
	opacity: 0.5;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const subnetDescription = css`
	padding: 0px 20px 20px;
	display: block;
	opacity: 0.8;
	font-size: 12px;
`;

const regCostContainerStyle = () => css`
	display: flex;
	flex-direction: row;

	& > div:first-of-type {
		flex: 1;
	}
`;

const regCostValueStyle = (theme: Theme) => css`
	display: flex;
	flex-direction: column;
	width: 200px;
	gap: 10px;
	margin-left: 24px;
	padding-left: 24px;
	border-left: 1px solid rgba(255, 255, 255, 0.1);

	& > span:first-of-type {
		font-size: 13px;
		color: ${theme.palette.secondary.dark};
	}
`;

export type SubnetPageParams = {
	id: string;
};

export const SubnetPage = () => {
	const { id } = useParams() as SubnetPageParams;
	const subnetObj = (subnetsJson as any)[id];
	const subnet = useSubnet({ id: { equalTo: id } });
	const subnetsHistory = useSubnetHistory(id);
	const subnetOwners = useSubnetOwners(id);
	const neuronRegCostHistory = useNeuronRegCostHistory(id);

	useDOMEventTrigger("data-loaded", !subnet.loading);

	const { hash: tab } = useLocation();
	useEffect(() => {
		if (tab) {
			document.getElementById(tab)?.scrollIntoView();
			window.scrollBy(0, -175);
		} else {
			window.scrollTo(0, 0);
		}
	}, [tab]);

	return (
		<>
			<Card data-test="subnet-info">
				<CardHeader css={subnetHeader}>
					<div css={subnetTitle}>Subnet</div>
					<div css={subnetName}>{subnetObj.name || "Unknown"}</div>
				</CardHeader>
				<div css={subnetDescription}>{subnetObj.description}</div>
				<SubnetInfoTable info={subnet} additional={subnetObj} />
			</Card>
			<Card data-test="subnet-metagraph">
				<TabbedContent defaultTab={tab.slice(1).toString()}>
					<TabPane
						label="Registration"
						loading={neuronRegCostHistory.loading}
						error={!!neuronRegCostHistory.error}
						value="registration"
					>
						<CardHeader>REGISTRATION DATA</CardHeader>
						<div css={regCostContainerStyle}>
							<NeuronRegistrationChart
								neuronRegCostHistory={neuronRegCostHistory}
								subnet={subnet}
							/>
							{subnet.loading ? (
								<Spinner small />
							) : (
								<div css={regCostValueStyle}>
									<span>Current Registration Cost</span>
									<span>
										{formatNumber(
											rawAmountToDecimal(
												subnet.data?.regCost?.toString()
											).toNumber(),
											{
												decimalPlaces: 2,
											}
										)}
										{NETWORK_CONFIG.currency}
									</span>
								</div>
							)}
						</div>
					</TabPane>
				</TabbedContent>
			</Card>
			<Card data-test="subnet-tables">
				<TabbedContent defaultTab={tab.slice(1).toString()}>
					<TabPane
						label="Owners"
						loading={subnetOwners.loading}
						error={!!subnetOwners.error}
						value="owners"
					>
						<SubnetOwnersTable subnetOwners={subnetOwners} />
					</TabPane>
					<TabPane
						label="Recycled (Lifetime)"
						loading={subnetsHistory.loading}
						error={!!subnetsHistory.error}
						value="recycled_lifetime"
					>
						<SubnetTaoRecycledHistoryChart
							subnetHistory={subnetsHistory}
							subnetId={id}
						/>
					</TabPane>
					<TabPane
						label="Recycled (Daily)"
						loading={subnetsHistory.loading}
						error={!!subnetsHistory.error}
						value="recycled_daily"
					>
						<SubnetTaoRecycled24HHistoryChart
							subnetHistory={subnetsHistory}
							subnetId={id}
						/>
					</TabPane>
				</TabbedContent>
			</Card>
		</>
	);
};
