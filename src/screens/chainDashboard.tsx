/** @jsxImportSource @emotion/react */
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";

import { Card, CardHeader } from "../components/Card";
import { useExtrinsicsWithoutTotalCount } from "../hooks/useExtrinsicsWithoutTotalCount";
import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";
import { TabbedContent, TabPane } from "../components/TabbedContent";
import { useNetworks } from "../hooks/useNetworks";
import { useTransfers } from "../hooks/useTransfers";
import TransfersTable from "../components/transfers/TransfersTable";
import { hasSupport } from "../services/networksService";

type ChainDashboardPageParams = {
	network: string;
};

function ChainDashboardPage() {
    
	const { network } = useParams() as ChainDashboardPageParams;
	const extrinsics = useExtrinsicsWithoutTotalCount(network, undefined, "id_DESC");
	const transfers = useTransfers(network, undefined, "id_DESC");

	useDOMEventTrigger("data-loaded", !extrinsics.loading);

	const networks = useNetworks();
	const networkData = networks.find((item) => item.name === network);
    
	useEffect(() => {
		if (extrinsics.pagination.offset === 0) {
			const interval = setInterval(extrinsics.refetch, 3000);
			return () => clearInterval(interval);
		}
	}, [extrinsics]);

	return (
		<>
			<Card>
				<CardHeader>
					{networkData?.displayName} dashboard
				</CardHeader>
			</Card>
			<Card>
				<TabbedContent>
					<TabPane
						label="Extrinsics"
						count={extrinsics.pagination.totalCount}
						loading={extrinsics.loading}
						error={extrinsics.error}
						value="extrinsics"
					>
						<ExtrinsicsTable network={network} extrinsics={extrinsics} showAccount showTime />
					</TabPane>

					{hasSupport(network, "main-squid") &&
							<TabPane
								label="Transfers"
								count={transfers.pagination.totalCount}
								loading={transfers.loading}
								error={transfers.error}
								value="transfers"
							>
								<TransfersTable network={network} transfers={transfers} showTime />
							</TabPane>
					}
				</TabbedContent>
			</Card>
		</>
	);
}

export default ChainDashboardPage;
