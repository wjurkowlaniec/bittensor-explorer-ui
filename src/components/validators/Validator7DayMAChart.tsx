/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";
import Chart from "react-apexcharts";

import LoadingSpinner from "../../assets/loading.svg";
import { useMemo } from "react";
import { nFormatter, rawAmountToDecimal } from "../../utils/number";
import {
	Validator7DayMA,
	Validator7DayMAResponse,
} from "../../model/validator";
import { NETWORK_CONFIG } from "../../config";

const spinnerContainer = css`
	display: flex;
	width: 100%;
	align-items: center;
	justify-content: center;
`;

export type Validator7DayMAChartProps = {
	address: string;
	movingAverage: Validator7DayMAResponse;
};

export const Validator7DayMAChart = (props: Validator7DayMAChartProps) => {
	const theme = useTheme();

	const { address, movingAverage } = props;

	const loading = movingAverage.loading;
	const timestamps = useMemo(() => {
		if (!movingAverage.data) return [];
		return movingAverage.data.map((x: Validator7DayMA) => x.timestamp);
	}, [movingAverage]);
	const weeklyAvg = useMemo(() => {
		if (!movingAverage.data) return [];
		return movingAverage.data.map(({ normWeeklyAvg }) =>
			rawAmountToDecimal(normWeeklyAvg.toString()).toNumber()
		);
	}, [movingAverage]);
	const [minWeeklyAvg, maxWeeklyAvg] = useMemo(() => {
		if (!movingAverage.data) return [0, 0];
		const data = movingAverage.data.map(({ normWeeklyAvg }) =>
			rawAmountToDecimal(normWeeklyAvg.toString()).toNumber()
		);
		return [Math.min(...data), Math.max(...data)];
	}, [movingAverage]);
	const take = useMemo(() => {
		if (!movingAverage.data) return [];
		return movingAverage.data.map(({ take }) => take / 1000);
	}, [movingAverage]);
	const [minTake, maxTake] = useMemo(() => {
		if (!movingAverage.data) return [0, 0];
		const data = movingAverage.data.map(({ take }) => take / 1000);
		return [Math.min(...data), Math.max(...data)];
	}, [movingAverage]);

	return loading ? (
		<div css={spinnerContainer}>
			<img src={LoadingSpinner} />
		</div>
	) : (
		<Chart
			height={400}
			series={[
				{
					name: "Weekly Avg",
					type: "area",
					data: weeklyAvg,
				},
				{
					name: "Take",
					type: "area",
					data: take,
				},
			]}
			options={{
				chart: {
					background: "#1a1a1a",
					toolbar: {
						show: true,
						offsetX: 0,
						offsetY: 0,
						autoSelected: "pan",
						tools: {
							selection: true,
							zoom: true,
							zoomin: true,
							zoomout: true,
							pan: true,
						},
						export: {
							csv: {
								filename: `norminator-return-${address}`,
								headerCategory: "Date",
							},
							png: {
								filename: `norminator-return-${address}`,
							},
							svg: {
								filename: `norminator-return-${address}`,
							},
						},
					},
					zoom: {
						enabled: true,
					},
				},
				colors: [theme.palette.success.main, theme.palette.neutral.main],
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
					text: "No records yet",
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
						formatter: (val: number) => {
							const day = new Date(val);
							const options: Intl.DateTimeFormatOptions = {
								day: "2-digit",
								month: "short",
								year: "2-digit",
							};
							const formattedDate = day.toLocaleDateString("en-US", options);
							return formattedDate;
						},
					},
					y: {
						formatter: (val: number, { seriesIndex }) => {
							if (seriesIndex === 0)
								return (
									NETWORK_CONFIG.currency + " " + nFormatter(val, 2).toString()
								);
							return nFormatter(val, 2).toString() + "%";
						},
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
				yaxis: [
					{
						labels: {
							style: {
								colors: theme.palette.success.main,
							},
							formatter: (val: number) => nFormatter(val, 2).toString(),
						},
						title: {
							text: `Weekly Avg (${NETWORK_CONFIG.currency})`,
							style: {
								color: theme.palette.success.main,
							},
						},
						axisTicks: {
							show: false,
						},
						axisBorder: {
							show: false,
						},
						min: minWeeklyAvg,
						max: maxWeeklyAvg,
					},
					{
						opposite: true,
						labels: {
							style: {
								colors: theme.palette.neutral.main,
							},
							formatter: (val: number) => nFormatter(val, 2).toString(),
						},
						title: {
							text: "Take (%)",
							style: {
								color: theme.palette.neutral.main,
							},
						},
						axisTicks: {
							show: false,
						},
						axisBorder: {
							show: false,
						},
						min: minTake * 0.9,
						max: maxTake * 1.1,
					},
				],
			}}
		/>
	);
};
