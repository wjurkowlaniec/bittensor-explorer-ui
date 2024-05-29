/** @jsxImportSource @emotion/react */
import { useEffect, useMemo, useState } from "react";
import { Button } from "@mui/material";
import { css, Theme } from "@emotion/react";
import { NETWORK_CONFIG } from "../config";
import { rawAmountToDecimal } from "../utils/number";
import { ButtonLink } from "./ButtonLink";
import { Validator, ValidatorMovingAverageResponse } from "../model/validator";
import { useSearchParams } from "react-router-dom";
import ValidatorsStakingInfoTable from "./validators/ValidatorsStakingInfoTable";

const calcLayout = css`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 35px;
	margin-bottom: 25px;
`;

const calcPanel = (theme: Theme) => css`
	background-color: ${theme.palette.primary.dark};
	padding: 24px;
	width: 368px;
`;

const inputLayout = css`
	margin: 0 0 8px;
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
	position: relative;
`;

const inputSuffix = css`
	display: inline-block;
	position: absolute;
	right: 10px;
	top: 50%;
	transform: translateY(-50%);
	font-size: 16px;
	font-weight: 500;
`;

const inputBody = css`
	height: 48px;
	background-color: #212121;
	color: #fff;
	padding-right: 30px;
	border: 0;
	padding: 0 25px 0 10px;
	line-height: 40px;
	width: 100%;
	max-width: 100%;
	border-radius: 4px;
	font-size: 17px;
`;

const valSelect = css`
	background-color: #212121;
`;

const radioLayout = css`
	display: flex;
	flex-direction: row;
	align-items: center;
	color: white;
	font-size: 13px;
	cursor: pointer;
	margin-right: 20px;
	margin-top: 10px;
`;

const normalRadio = css`
	border: 1px solid rgba(255, 255, 255, 0.65);
	border-radius: 2px;
	width: 15px;
	height: 15px;
	margin-right: 5px;
`;

const checkedRadio = css`
	background-color: #f90;
	border-color: #f90;
`;

const maCss = css`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	color: #fff;
	font-size: 13px;
	margin: 5px 0;
`;

const calcButton = (theme: Theme) => css`
	width: 100%;
	padding: 17px;
	margin: 10px 0 0;
	background-color: ${theme.palette.text.primary};
	color: #000;
	font-size: 13px;
	font-weight: 600;
	letter-spacing: 0.1em;
`;

const returnTitle = css`
	font-size: 13px;
	margin-top: 15px;
`;

const taoValue = (theme: Theme) => css`
	color: ${theme.palette.success.main};
`;

const usdValue = css`
	color: #fff;
`;

const stakeCalc = (theme: Theme) => css`
	padding: 8px 13px;
	background-color: ${theme.palette.text.primary};
	color: #000;
	font-size: 13px;
	font-weight: 600;
	letter-spacing: 0.1em;
	margin-top: 25px;
`;

function StakingCalculator({
	tokenPrice,
	totalStake,
	validators,
	movingAvg,
}: {
	tokenPrice: number;
	totalStake: bigint;
	validators: Validator[];
	movingAvg: ValidatorMovingAverageResponse;
}) {
	const [qs] = useSearchParams();
	const valAddr = qs.get("query") || "";

	const [isStaker, setAsStaker] = useState(true);
	const [amount, setAmount] = useState("1");
	const [price, setPrice] = useState(tokenPrice.toString());
	const [validator, setValidator] = useState<Validator>();
	const [result, setResult] = useState({
		dailyTAO: 0,
		dailyUSD: 0,
		monthlyTAO: 0,
		monthlyUSD: 0,
		yearlyTAO: 0,
		yearlyUSD: 0,
		apr: 0,
	});

	const calcReturn = (vali: any) => {
		const validatorsAPR =
			((0.1 * 365.25) / rawAmountToDecimal(totalStake.toString()).toNumber()) *
			100;
		const valTake = 1 - (vali.take ?? 0) / 65535;
		const dailyAPRUnit = validatorsAPR * (isStaker ? valTake : 1) * 0.82;
		const amountDecimal = parseFloat(amount);
		const priceDecimal = parseFloat(price);

		const dailyAPR = dailyAPRUnit * amountDecimal;
		const monthlyAPR = dailyAPR * 30;
		const yaerlyAPR = monthlyAPR * 12;

		const ma = movingAvg.data.find((x) => x.address === vali.address);
		const apr =
			rawAmountToDecimal(ma?.norm30DayAvg.toString()).toNumber() * 0.1 * 365;

		return {
			dailyTAO: dailyAPR,
			dailyUSD: dailyAPR * priceDecimal,
			monthlyTAO: monthlyAPR,
			monthlyUSD: monthlyAPR * priceDecimal,
			yearlyTAO: yaerlyAPR,
			yearlyUSD: yaerlyAPR * priceDecimal,
			apr: apr,
		};
	};

	useEffect(() => {
		const defaultVal = validators.find((val) => val.address === valAddr);
		setValidator(defaultVal ?? validators[0]);
	}, [valAddr]);

	useEffect(() => {
		if (validator) setResult(calcReturn(validator));
	}, [validator]);

	const valisForTable = useMemo(() => {
		const newValis = [];
		for (let i = 0; i < validators.length; i++) {
			const ma = movingAvg.data.find(
				(x) => x.address === validators[i]?.address
			);
			const ret = calcReturn(validators[i]);
			newValis.push({
				...validators[i],
				...ma,
				...ret,
			});
		}
		return newValis;
	}, [validators]);

	return (
		<div>
			<div css={calcLayout}>
				<div css={calcPanel}>
					<div css={inputLayout}>
						<span css={inputSuffix}>{NETWORK_CONFIG.currency}</span>
						<input
							css={inputBody}
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
						/>
					</div>
					<div css={inputLayout}>
						<span css={inputSuffix}>$</span>
						<input
							css={inputBody}
							value={price}
							onChange={(e) => setPrice(e.target.value)}
						/>
					</div>
					<div css={inputLayout}>
						<select
							css={valSelect}
							value={validator?.address}
							onChange={(e) =>
								setValidator(
									validators.find((val) => val.address === e.target.value)
								)
							}
						>
							{validators.map((val) => (
								<option value={val.address} key={val.id}>
									{val.name ?? val.address}
								</option>
							))}
						</select>
					</div>
					<div css={inputLayout}>
						<div css={radioLayout} onClick={() => setAsStaker(true)}>
							<div css={[normalRadio, isStaker && checkedRadio]} /> Staker
						</div>
						<div css={radioLayout} onClick={() => setAsStaker(false)}>
							<div css={[normalRadio, !isStaker && checkedRadio]} /> Validator
						</div>
					</div>
					<div css={maCss}>
						<span>30 Days Moving Average</span>
						<span>{result.apr.toFixed(2)}%</span>
					</div>
					<Button
						size="small"
						variant="contained"
						color="secondary"
						css={calcButton}
						onClick={() => setResult(calcReturn(validator))}
					>
						CALCULATE
					</Button>
				</div>
				<div>
					<div css={returnTitle}>Daily Staking Return</div>
					<div css={taoValue}>
						{result.dailyTAO.toFixed(2)}
						{NETWORK_CONFIG.currency}
					</div>
					<div css={usdValue}>${result.dailyUSD.toFixed(2)}</div>
					<div css={returnTitle}>Monthly Staking Return</div>
					<div css={taoValue}>
						{result.monthlyTAO.toFixed(2)}
						{NETWORK_CONFIG.currency}
					</div>
					<div css={usdValue}>${result.monthlyUSD.toFixed(2)}</div>
					<div css={returnTitle}>Yearly Staking Return</div>
					<div css={taoValue}>
						{result.yearlyTAO.toFixed(2)}
						{NETWORK_CONFIG.currency}
					</div>
					<div css={usdValue}>${result.yearlyUSD.toFixed(2)}</div>
					<div css={returnTitle}>Ready to delegate some stake?</div>
					<ButtonLink
						to={`https://delegate.taostats.io/staking/?hkey=${validator?.address}&_gl=1*1n668ce*_ga*MTg2NzIzMTA0Ny4xNzEyMDc3NDk3*_ga_VCM7H6TDR4*MTcxNjkzNzQ5NS4yNS4xLjE3MTY5MzkzOTkuMC4wLjA.`}
						size="small"
						color="secondary"
						variant="contained"
						css={stakeCalc}
					>
						STAKE TAO
					</ButtonLink>
				</div>
			</div>
			<ValidatorsStakingInfoTable
				validators={valisForTable}
				selected={validator}
			/>
		</div>
	);
}

export default StakingCalculator;
