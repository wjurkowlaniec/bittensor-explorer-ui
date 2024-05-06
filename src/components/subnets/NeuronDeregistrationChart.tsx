/** @jsxImportSource @emotion/react */
import { css, useTheme } from "@emotion/react";
import Chart from "react-apexcharts";

import LoadingSpinner from "../../assets/loading.svg";
import { useMemo } from "react";
import { nFormatter, rawAmountToDecimal } from "../../utils/number";
import { NETWORK_CONFIG } from "../../config";
import {
	NeuronDeregistration,
	NeuronDeregistrationResponse,
} from "../../model/subnet";

const spinnerContainer = css`
	display: flex;
	width: 100%;
	align-items: center;
	justify-content: center;
`;

export type NeuronDeregistrationChartProps = {
	neuronDeregistrations: NeuronDeregistrationResponse;
};

export const NeuronDeregistrationChart = (
	props: NeuronDeregistrationChartProps
) => {
	const theme = useTheme();

	const { neuronDeregistrations } = props;

	const loading = neuronDeregistrations.loading;
	const timestamps = useMemo(() => {
		if (!neuronDeregistrations.data) return [];
		return neuronDeregistrations.data.map(
			(x: NeuronDeregistration) => x.timestamp
		);
	}, [neuronDeregistrations]);
	const [minIncentive, maxIncentive] = useMemo(() => {
		const { data } = neuronDeregistrations;
		if (!data) return [0, 0];

		const dat = data.map(({ incentive }) => incentive / 65535);
		return [Math.min(...dat), Math.max(...dat)];
	}, [neuronDeregistrations]);
	const [minEmission, maxEmission] = useMemo(() => {
		const { data } = neuronDeregistrations;
		if (!data) return [0, 0];

		const dat = data.map(({ emission }) =>
			rawAmountToDecimal(emission.toString()).toNumber()
		);
		return [Math.min(...dat), Math.max(...dat)];
	}, [neuronDeregistrations]);
	const incentive = useMemo(() => {
		if (!neuronDeregistrations.data) return [];
		return neuronDeregistrations.data.map(({ incentive }) => incentive / 65535);
	}, [neuronDeregistrations]);
	const emission = useMemo(() => {
		if (!neuronDeregistrations.data) return [];
		return neuronDeregistrations.data.map(({ emission }) =>
			rawAmountToDecimal(emission.toString()).toNumber()
		);
	}, [neuronDeregistrations]);

	return loading ? (
		<div css={spinnerContainer}>
			<img src={LoadingSpinner} />
		</div>
	) : (
		<Chart
			height={400}
			series={[
				{
					name: "Incentive",
					type: "area",
					data: incentive,
				},
				{
					name: `Emission (${NETWORK_CONFIG.currency})`,
					type: "area",
					data: emission,
				},
			]}
			options={{
				chart: {
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
								filename: "neuron-deregistration-data",
								headerCategory: "Date",
							},
							png: {
								filename: "neuron-deregistration-data",
							},
							svg: {
								filename: "neuron-deregistration-data",
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
					text: "No neuron deregistration records found",
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
					curve: "smooth",
					width: 1,
					lineCap: "butt",
					dashArray: 0,
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
				tooltip: {
					theme: "dark",
					shared: true,
					intersect: false,
					x: {
						format: "dd MMM H:mm",
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
							formatter: (val: number) => nFormatter(val, 6).toString(),
						},
						title: {
							text: "Incentive",
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
						min: minIncentive,
						max: maxIncentive,
					},
					{
						opposite: true,
						labels: {
							style: {
								colors: theme.palette.neutral.main,
							},
							formatter: (val: number) => nFormatter(val, 6).toString(),
						},
						title: {
							text: `Emission (${NETWORK_CONFIG.currency})`,
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
						min: minEmission * 0.95,
						max: maxEmission * 1.05,
					},
				],
			}}
		/>
	);
};
