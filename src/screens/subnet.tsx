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
import { useEffect, useState } from "react";
import { TabbedContent, TabPane } from "../components/TabbedContent";
import { SubnetTaoRecycled24HHistoryChart } from "../components/subnets/SubnetTaoRecycled24HHistoryChart";
import Spinner from "../components/Spinner";
import { formatNumber, rawAmountToDecimal } from "../utils/number";
import { NETWORK_CONFIG } from "../config";
import { useNeuronRegCostHistory } from "../hooks/useNeuronRegCostHistory";
import { NeuronRegistrationChart } from "../components/subnets/NeuronRegistrationChart";
import {
	NeuronMetagraphOrder,
	NeuronRegEventsOrder,
} from "../services/subnetsService";
import NeuronMetagraphTable from "../components/subnets/NeuronMetagraphTable";
import { useNeuronMetagraph } from "../hooks/useNeuronMetagraph";
import CheckShield from "../assets/check-shield.svg";
import Certification from "../assets/certification.svg";
import { useSingleSubnetStat } from "../hooks/useSingleSubnetStat";
import { StatItem } from "../components/subnets/StatItem";
import { useNeuronRegEvents } from "../hooks/useNeuronRegEvents";
import NeuronRegEventsTable from "../components/subnets/NeuronRegEventsTable";

const subnetHeader = (theme: Theme) => css`
	display: flex;
	flex-wrap: wrap;
	gap: 4px;
	align-items: center;
	word-break: keep-all;
	color: ${theme.palette.text.primary};
`;

const subnetName = css`
	font-size: 20px;
`;

const subnetDescription = css`
	padding: 0px 20px 20px;
	display: block;
	opacity: 0.8;
	font-size: 12px;
`;

const statItems = css`
	display: flex;
	flex-direction: column;
	gap: 8px;
	flex-grow: 1;
	@media only screen and (max-width: 1399px) {
		width: 100%;
	}
	padding-left: 20px;
`;

const statItemsRow = css`
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	width: 100%;
	@media only screen and (max-width: 1199px) {
		grid-template-columns: repeat(2, 1fr);
	}
	@media only screen and (max-width: 767px) {
		grid-template-columns: repeat(1, 1fr);
	}
`;

const metagraphStyle = css`
	margin: 64px 0;
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

const metagraphComment = () => css`
	font-size: 13px;
	margin-bottom: 25px;
`;

const regEventsTable = () => css`
	margin-top: 50px;
`;

const validatorComment = () => css`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 5px;
`;

export type SubnetPageParams = {
	id: string;
};

export const SubnetPage = () => {
	const { id } = useParams() as SubnetPageParams;
	const subnetObj = (subnetsJson as any)[id];
	const subnet = useSubnet({ id: { equalTo: id } });
	const subnetStat = useSingleSubnetStat({ netUid: { equalTo: parseInt(id) } });
	const subnetsHistory = useSubnetHistory(id);
	const subnetOwners = useSubnetOwners(id);
	const neuronRegCostHistory = useNeuronRegCostHistory(id);

	const neuronMetagraphInitialOrder: NeuronMetagraphOrder = "STAKE_DESC";
	const [neuronMetagraphSort, setNeuronMetagraphSort] =
		useState<NeuronMetagraphOrder>(neuronMetagraphInitialOrder);
	const neuronMetagraph = useNeuronMetagraph(
		{ netUid: { equalTo: parseInt(id) } },
		neuronMetagraphSort
	);

	const [regEventsFrom, setRegEventsFrom] = useState("");
	useEffect(() => {
		const now = Date.now();
		const from = new Date(now - 24 * 60 * 60 * 1000).toISOString();
		setRegEventsFrom(from);
	}, []);
	const neuronRegEventsInitialOrder: NeuronRegEventsOrder = "TIMESTAMP_DESC";
	const [neuronRegEventsSort, setNeuronRegEventsSort] =
		useState<NeuronRegEventsOrder>(neuronRegEventsInitialOrder);
	const neuronRegEvents = useNeuronRegEvents(
		{
			netUid: { equalTo: parseInt(id) },
			timestamp: { greaterThan: regEventsFrom },
		},
		neuronRegEventsSort
	);

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
					<div css={subnetName}>{subnetObj.name || "Unknown"}</div>
				</CardHeader>
				<div css={subnetDescription}>{subnetObj.description}</div>
				<SubnetInfoTable info={subnet} additional={subnetObj} />
				<div css={statItems}>
					<div css={statItemsRow}>
						<StatItem
							title="Emissions"
							value={`${formatNumber(
								rawAmountToDecimal(subnet?.data?.emission).toNumber() * 100,
								{
									decimalPlaces: 2,
								}
							)}%`}
						/>
						<StatItem
							title="Recycled (Lifetime)"
							value={`${formatNumber(
								rawAmountToDecimal(
									subnet.data?.recycledLifetime?.toString()
								).toNumber(),
								{
									decimalPlaces: 2,
								}
							)}
						${NETWORK_CONFIG.currency}`}
						/>
						<StatItem
							title="Recycled (24h)"
							value={`${formatNumber(
								rawAmountToDecimal(
									subnet.data?.recycled24H?.toString()
								).toNumber(),
								{
									decimalPlaces: 2,
								}
							)}
						${NETWORK_CONFIG.currency}`}
						/>
						<StatItem
							title="Registration Cost"
							value={`${formatNumber(
								rawAmountToDecimal(
									subnetStat.data?.regCost?.toString()
								).toNumber(),
								{
									decimalPlaces: 2,
								}
							)}
						${NETWORK_CONFIG.currency}`}
						/>
					</div>
					<div css={statItemsRow}>
						<StatItem
							title="Active Keys"
							value={subnetStat?.data?.activeKeys}
							total={subnetStat?.data?.maxNeurons}
						/>
						<StatItem
							title="Active Validators"
							value={subnetStat?.data?.activeValidators}
							total={subnetStat?.data?.validators}
						/>
						<StatItem
							title="Active Miners"
							value={subnetStat?.data?.activeMiners}
							total={subnetStat?.data?.maxNeurons}
						/>
						<StatItem
							title="Active Dual Miners/Validators"
							value={subnetStat?.data?.activeDual}
							total={subnetStat?.data?.validators}
						/>
					</div>
				</div>
			</Card>
			<div css={metagraphStyle}>
				<TabbedContent defaultTab={tab.slice(1).toString()} noPadding>
					<TabPane
						label="Metagraph"
						loading={subnetOwners.loading}
						error={!!subnetOwners.error}
						value="metagraph"
					>
						<div css={metagraphComment}>
							<div>Click on any UID for detailed stats.</div>
							<div css={validatorComment}>
								<img src={CheckShield} />
								<span>are validators.</span>
							</div>
							<div css={validatorComment}>
								<img src={Certification} />
								<span>are keys in immunity.</span>
							</div>
						</div>
						<NeuronMetagraphTable
							metagraph={neuronMetagraph}
							onSortChange={(sortKey: NeuronMetagraphOrder) =>
								setNeuronMetagraphSort(sortKey)
							}
							initialSort={neuronMetagraphInitialOrder}
						/>
					</TabPane>
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
								subnetStat={subnetStat}
							/>
							{subnet.loading ? (
								<Spinner small />
							) : (
								<div css={regCostValueStyle}>
									<span>Current Registration Cost</span>
									<span>
										{formatNumber(
											rawAmountToDecimal(
												subnetStat.data?.regCost?.toString()
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
						<CardHeader css={regEventsTable}>REGISTRATIONS TABLE</CardHeader>
						<NeuronRegEventsTable
							regEvents={neuronRegEvents}
							onSortChange={(sortKey: NeuronRegEventsOrder) =>
								setNeuronRegEventsSort(sortKey)
							}
							initialSort={neuronRegEventsInitialOrder}
						/>
					</TabPane>
				</TabbedContent>
			</div>
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
						label="Recycled (24h)"
						loading={subnetsHistory.loading}
						error={!!subnetsHistory.error}
						value="recycled_24h"
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
