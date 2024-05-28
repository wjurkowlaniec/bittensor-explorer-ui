/** @jsxImportSource @emotion/react */
import { Theme, css } from "@emotion/react";
import Decimal from "decimal.js";

import { Link } from "../components/Link";
import Loading from "../components/Loading";
import NotFound from "../components/NotFound";
import { StatItem } from "../components/network/StatItem";
import { NETWORK_CONFIG } from "../config";
import { useAppStats } from "../contexts";
import { formatNumber, rawAmountToDecimal } from "../utils/number";
import StakingCalculator from "../components/StakingCalculator";
import { useValidators } from "../hooks/useValidators";

const defaultText = (theme: Theme) => css`
	color: ${theme.palette.secondary.dark};
`;

const greenText = (theme: Theme) => css`
	color: ${theme.palette.success.main};
`;

const header = css`
	font-size: 19px;
	color: white;
	margin-top: 40px;
`;

const smallLayout = css`
	width: 1000px;
	max-width: 100%;
	margin: 20px 0;
`;

const smallHeader = css`
	padding: 2px 8px;
	background-color: #e5e3e3;
	color: #000;
	display: inline-block;
	margin-top: 20px;
`;

const description = css`
	font-size: 14px;
	margin-top: 15px;
`;

const statItems = css`
	display: flex;
	flex-direction: column;
	gap: 8px;
	flex-grow: 1;
	width: 1000px;
	max-width: 100%;
`;

const statItemsRow = css`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 40px;
	width: 100%;
`;

const font30 = css`
	font-size: 30px;
`;

export const StakingPage = () => {
	const {
		state: {
			chainStats: chain,
			chainLoading: chainStatsLoading,
			tokenStats: token,
			tokenLoading: tokenStatsLoading,
		},
	} = useAppStats();
	const validators = useValidators();

	const loading = chainStatsLoading || tokenStatsLoading || validators.loading;

	if (loading) return <Loading />;
	if (chain === undefined || token === undefined) {
		return <NotFound>Stats not found.</NotFound>;
	}

	const totalSupply = rawAmountToDecimal("21000000000000000");

	return (
		<>
			<div css={defaultText}>
				<div css={statItems}>
					<div css={statItemsRow}>
						<StatItem
							title="Staking APY"
							value={`${token.stakingAPY}%`}
							valueCSS={font30}
						/>
						<StatItem
							title="Validating APY"
							value={`${token.validationAPY}%`}
							valueCSS={font30}
						/>
						<StatItem
							title="Total Staked"
							value={`${formatNumber(
								rawAmountToDecimal(chain.staked.toString()),
								{ decimalPlaces: 0 }
							)}${NETWORK_CONFIG.currency} (${formatNumber(
								new Decimal(chain.staked.toString())
									.mul(100)
									.div(new Decimal(chain.issued.toString())),
								{ decimalPlaces: 2 }
							)}%)`}
						/>
						<StatItem
							title="Total Issuance"
							value={`${formatNumber(
								rawAmountToDecimal(chain.issued.toString()),
								{ decimalPlaces: 0 }
							)}${NETWORK_CONFIG.currency}`}
							suffix={NETWORK_CONFIG.currency}
						/>
						<StatItem
							title="Total Supply"
							value={`${formatNumber(totalSupply, { decimalPlaces: 0 })}${
								NETWORK_CONFIG.currency
							}`}
						/>
					</div>
				</div>
				<div css={header}>STAKING CALCULATOR</div>
				<div css={smallLayout}>
					<div css={description}>
						Enter TAO quantity and price to calculate staking returns
					</div>
					<div css={description}>
						The APR is based on the total validator emissions for ALL validators
						across the network and does not take into account differences in
						validator performance or subnet allocation. The APR does not
						calculate compounding as it would be a false metric to provide APY
						based on declining APR.
					</div>
					<div css={description}>
						Staking APR follows the same conditions as the validator APR but
						also applies the 18% validator commission.
					</div>
				</div>
				<StakingCalculator
					tokenPrice={token.price}
					totalStake={chain.staked}
					validators={validators.data ?? []}
				/>
				<div css={header}>HOW TO EARN TAO</div>
				<div css={smallLayout}>
					<div css={description}>
						<span css={greenText}>
							It is possible to earn TAO is through mining, validating or
							delegating stake.
						</span>{" "}
						Mining and validating require running a CPU or GPU server and
						further knowledge to ensure your miner/validator stays online
						consistently and remains competitive.
					</div>
					<div css={smallHeader}>MINING</div>
					<div css={description}>
						Since there is a knowledge barrier to mining, unlike BTC or ETH
						mining, you must first learn to fine tune AI models in order to
						remain competitive on the network. Please see the{" "}
						<Link
							to="https://taostats.io/#resources"
							color="#fff"
							underline="always"
							style={{ textDecorationColor: "#fff", textUnderlineOffset: 5 }}
						>
							Resources
						</Link>{" "}
						and also{" "}
						<Link
							to="https://docs.taostats.io/Fine_tuning.html?_gl=1*ac72g9*_ga*MTg2NzIzMTA0Ny4xNzEyMDc3NDk3*_ga_VCM7H6TDR4*MTcxNjg1NjA3My4yMi4wLjE3MTY4NTYwNzMuMC4wLjA."
							color="#fff"
							underline="always"
							style={{ textDecorationColor: "#fff", textUnderlineOffset: 5 }}
						>
							docs.taostats.io/fine-tuning-examples-mining
						</Link>{" "}
						for more information on mining and fine tuning examples.
					</div>
					<div css={smallHeader}>VALIDATING</div>
					<div css={description}>
						Validating, whilst not requiring any knowledge beyond the setup of
						the validator on a Linux server, does have a financial barrier to
						entry as there is a minimum TAO requirement to be in the allotted
						number of network validators to successfully receive rewards.
						Validators must also run different servers with varying requirements
						across multiple subnets in order to earn the maximum amount of
						dividends and attract delegated stake from nominators to increase
						their overall stake and priority in the network. Please see{" "}
						<Link
							to="https://docs.taostats.io/generate_signature.html?_gl=1*1q46dgc*_ga*MTg2NzIzMTA0Ny4xNzEyMDc3NDk3*_ga_VCM7H6TDR4*MTcxNjg1NjA3My4yMi4wLjE3MTY4NTYwNzMuMC4wLjA."
							color="#fff"
							underline="always"
							style={{ textDecorationColor: "#fff", textUnderlineOffset: 5 }}
						>
							docs.taostats.io/information-for-validation
						</Link>{" "}
						and{" "}
						<Link
							to="https://taostats.io/#resources"
							color="#fff"
							underline="always"
							style={{ textDecorationColor: "#fff", textUnderlineOffset: 5 }}
						>
							Resources
						</Link>{" "}
						for more information on validating.
					</div>
					<div css={smallHeader}>STAKING</div>
					<div css={description}>
						<span css={greenText}>
							Since the successful launch of the Finney network, users are able
							to delegate a stake to any validator for a share of the validation
							rewards
						</span>{" "}
						(a fixed commission of 17.99% will be applied to all delegations).
					</div>
					<div css={description}>
						<span css={greenText}>
							This enables all holders of the TAO token to earn passive income
							rewards regardless of the size of their holdings.
						</span>{" "}
						It is intended to encourage users to delegate to the Foundation
						validator or support the projects and teams promoting the growth of
						the network.
					</div>
					<div css={description}>
						It is possible to delegate to any active validator who has elected
						to receive nominations.
					</div>
					<div css={description}>
						In order to stake (delegate) your Tao you must nominate it to a
						validator. There are a number of ways to do this through a command
						line installation of{" "}
						<Link
							to="https://bittensor.com/documentation/delegation_staking"
							color="#fff"
							underline="always"
							style={{ textDecorationColor: "#fff", textUnderlineOffset: 5 }}
						>
							Bittensor
						</Link>
						, using{" "}
						<Link
							to="https://docs.bittensor.com/StakingGuide.html"
							color="#fff"
							underline="always"
							style={{ textDecorationColor: "#fff", textUnderlineOffset: 5 }}
						>
							PolkadotJS
						</Link>
						, but the simplest is using our{" "}
						<Link
							to="https://delegate.taostats.io/?_gl=1*ac72g9*_ga*MTg2NzIzMTA0Ny4xNzEyMDc3NDk3*_ga_VCM7H6TDR4*MTcxNjg1NjA3My4yMi4wLjE3MTY4NTYwNzMuMC4wLjA."
							color="#fff"
							underline="always"
							style={{ textDecorationColor: "#fff", textUnderlineOffset: 5 }}
						>
							Delegation App
						</Link>{" "}
						provided by TaoStats.
					</div>
					<div css={description}>
						You can see a list of all Verified Validators and their details and
						hotkeys here.
					</div>
				</div>
			</div>
		</>
	);
};
