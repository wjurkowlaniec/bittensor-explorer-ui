/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";
import Chart from "react-apexcharts";

import LoadingSpinner from "../../assets/loading.svg";
import { AccountStats, AccountStatsResponse } from "../../model/accountStats";
import { useMemo } from "react";
import { formatNumber, nFormatter, rawAmountToDecimal } from "../../utils/number";
import { AccountBalanceHistory, AccountBalanceHistoryResponse } from "../../model/accountBalanceHistory";
import Decimal from "decimal.js";

const spinnerContainer = css`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export type AccounBalanceHistoryChartProps = {
	balanceHistory: AccountBalanceHistoryResponse;
}

export const AccounBalanceHistoryChart = (props: AccounBalanceHistoryChartProps) => {
	const theme = useTheme();

	const { balanceHistory } = props;

	const loading = balanceHistory.loading;
	const timestamps = useMemo(() => {
		if (!balanceHistory.data) return [];
		const resp = (balanceHistory.data as any).reduce(
			(prev: string[], cur: AccountBalanceHistory) => {
				prev.push(cur.timestamp);
				return prev;
			},
			[]
		);
		return resp;
	}, [balanceHistory]);
	const maxBalance = useMemo(() => {
		if (!balanceHistory.data) return 0;
		const resp = (balanceHistory.data as any).reduce(
			(prev: number, cur: AccountBalanceHistory) => {
				const now = rawAmountToDecimal(cur.balanceTotal.toString()).toNumber();
				return now > prev ? now : prev;
			},
			0
		);
		return resp;
	}, [balanceHistory]);
	const totalBalance = useMemo(() => {
		if (!balanceHistory.data) return [];
		const resp = (balanceHistory.data as any).reduce(
			(prev: number[], cur: AccountBalanceHistory) => {
				prev.push(rawAmountToDecimal(cur.balanceTotal.toString()).toNumber());
				return prev;
			},
			[]
		);
		return resp;
	}, [balanceHistory]);
	const totalStaked = useMemo(() => {
		if (!balanceHistory.data) return [];
		const resp = (balanceHistory.data as any).reduce(
			(prev: number[], cur: AccountBalanceHistory) => {
				prev.push(rawAmountToDecimal(cur.balanceStaked.toString()).toNumber());
				return prev;
			},
			[]
		);
		return resp;
	}, [balanceHistory]);
	const totalFree = useMemo(() => {
		if (!balanceHistory.data) return [];
		const resp = (balanceHistory.data as any).reduce(
			(prev: number[], cur: AccountBalanceHistory) => {
				prev.push(rawAmountToDecimal(cur.balanceFree.toString()).toNumber());
				return prev;
			},
			[]
		);
		return resp;
	}, [balanceHistory]);

	return loading ? (
		<div css={spinnerContainer}>
			<img src={LoadingSpinner} />
		</div>
	) : (
		<Chart
			height={400}
			series={[
				{
					name: "Free Balance",
					type: "area",
					data: totalFree,
				},
				{
					name: "Delegated Balance",
					type: "area",
					data: totalStaked,
				},
				{
					name: "Total Balance",
					type: "area",
					data: totalBalance,
				},
			]}
			options={{
				chart: {
					toolbar: {
						show: false,
					},
					zoom: {
						enabled: false,
					},
				},
				colors: [
					theme.palette.error.main,
					theme.palette.success.main,
					theme.palette.neutral.main,
				],
				dataLabels: {
					enabled: false,
				},
				fill: {
					type: "gradient",
					gradient: {
						shade: "dark",
						shadeIntensity: 1,
						inverseColors: false,
						type: "vertical",
						opacityFrom: 0.6,
						opacityTo: 0.1,
						stops: [0, 90, 100],
					},
				},
				grid: {
					show: false,
				},
				labels: timestamps,
				legend: {
					show: false,
				},
				markers: {
					size: 0,
				},
				noData: {
					text: "Loading ...",
					align: "center",
					verticalAlign: "middle",
					offsetX: 0,
					offsetY: 0,
					style: {
						color: "#FFFFFF",
					},
				},
				responsive: [
					{
						breakpoint: 767,
						options: {
							chart: {
								height: 320,
							},
						},
					},
					{
						breakpoint: 599,
						options: {
							chart: {
								height: 270,
							},
						},
					},
				],
				stroke: {
					width: 1,
				},
				tooltip: {
					theme: "dark",
					shared: true,
					intersect: false,
					x: {
						format: "dd MMM yy",
					},
					y: {
						formatter: (val: number) => nFormatter(val, 2).toString(),
					},
				},
				xaxis: {
					axisTicks: {
						show: false,
					},
					axisBorder: {
						show: false,
					},
					labels: {
						style: {
							fontSize: "11px",
							colors: "#7F7F7F",
						},
					},
					type: "datetime",
				},
				yaxis: {
					opposite: true,
					labels: {
						style: {
							colors: "#a8a8a8",
						},
						formatter: (val: number) => nFormatter(val, 2).toString(),
					},
					axisTicks: {
						show: false,
					},
					axisBorder: {
						show: false,
					},
					min: 0,
					max: maxBalance,
				},
			}}
		/>
	);
};
