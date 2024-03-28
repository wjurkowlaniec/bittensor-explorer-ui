/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Chart from "react-apexcharts";

import LoadingSpinner from "../../assets/loading.svg";
import { useMemo } from "react";
import { MinerIncentive, MinerIncentiveResponse } from "../../model/subnet";

const spinnerContainer = css`
	display: flex;
	width: 100%;
	align-items: center;
	justify-content: center;
`;

export type MinerIncentiveDistributionChartProps = {
	minerIncentive: MinerIncentiveResponse;
};

export const MinerIncentiveDistributionChart = (
	props: MinerIncentiveDistributionChartProps
) => {
	const { minerIncentive } = props;

	const loading = minerIncentive.loading;
	const series = useMemo(() => {
		if (loading) return [];
		const result = (minerIncentive.data as any).reduce(
			(
				prev: { x: number; y: number; flag: boolean }[],
				cur: MinerIncentive
			) => [
				...prev,
				{
					x: prev.length + 1,
					y: cur.incentive / 65535,
					flag: cur.isImmunityPeriod,
				},
			],
			[]
		);
		const immuneKeys = result.filter((x: any) => x.flag);
		const activeKeys = result.filter((x: any) => !x.flag);

		return [
			{
				name: "Active Key",
				data: activeKeys,
			},
			{
				name: "Immune Key",
				data: immuneKeys,
			},
		];
	}, [minerIncentive]);

	const minValue = useMemo(() => {
		if (loading) return 0;
		return minerIncentive.data.reduce((min: number, cur: MinerIncentive) => {
			const newMin = cur.incentive / 65535;
			if (min === -1) return newMin;
			return min < newMin ? min : newMin;
		}, -1);
	}, [minerIncentive]);
	const maxValue = useMemo(() => {
		if (loading) return 0;
		return minerIncentive.data.reduce((max: number, cur: MinerIncentive) => {
			const newMax = cur.incentive / 65535;
			return max > newMax ? max : newMax;
		}, 0);
	}, [minerIncentive]);
	const lowestActiveKey = useMemo(() => {
		if (loading) return 0;
		return minerIncentive.data.reduce((min: number, cur: MinerIncentive) => {
			if (cur.isImmunityPeriod || cur.incentive === 0) return min;
			const newMin = cur.incentive / 65535;
			if (min === -1) return newMin;
			return min < newMin ? min : newMin;
		}, -1);
	}, [minerIncentive]);

	return loading ? (
		<div css={spinnerContainer}>
			<img src={LoadingSpinner} />
		</div>
	) : (
		<Chart
			height={560}
			series={series}
			type="scatter"
			options={{
				chart: {
					toolbar: {
						offsetX: 0,
						offsetY: 0,
						tools: {
							download: false,
							selection: false,
							zoom: true,
							zoomin: true,
							zoomout: true,
							pan: true,
						},
					},
				},
				grid: {
					padding: {
						left: 0,
					},
					show: false,
					yaxis: {
						lines: {
							show: false,
						},
					},
					row: {
						colors: ["transparent", "transparent"],
						opacity: 0,
					},
					column: {
						colors: ["transparent", "transparent"],
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
				tooltip: {
					enabled: true,
					theme: "dark",
					x: {
						show: false,
					},
				},
				dataLabels: {
					enabled: true,
					formatter: (_, opts) => opts.value,
				},
				legend: {
					show: true,
					position: "right",
					floating: false,
					fontSize: "13px",
					labels: {
						colors: undefined,
						useSeriesColors: true,
					},
				},
				colors: ["#14dec2", "#FF9900", "#444444"],
				annotations: {
					yaxis: [
						{
							y: lowestActiveKey,
							borderColor: "#14dec2",
							label: {
								text: `Lowest Active Key (${lowestActiveKey.toFixed(5)})`,
								style: {
									color: "#fff",
									background: "#000000",
								},
							},
						},
					],
				},
				markers: {
					strokeWidth: 0,
					size: 3,
					shape: "rect",
					discrete: [
						{
							seriesIndex: 0,
							size: 1,
							shape: "circle",
							strokeColor: "#14dec2",
						},
						{
							seriesIndex: 1,
							size: 1,
							strokeColor: "#FF9900",
						},
					],
				},
				yaxis: [
					{
						axisTicks: {
							show: false,
						},
						axisBorder: {
							show: false,
							color: "#14dec2",
						},
						labels: {
							style: {
								colors: "#14dec2",
							},
							formatter: function (val) {
								return val.toFixed(5);
							},
						},
						title: {
							text: "Incentive",
							style: {
								color: "#14dec2",
							},
						},
						max: maxValue,
						min: minValue,
					},
				],
				xaxis: {
					labels: {
						style: {
							colors: "#a8a8a8",
						},
					},
					axisTicks: {
						show: false,
					},
					tickAmount: 2,
				},
			}}
		/>
	);
};
