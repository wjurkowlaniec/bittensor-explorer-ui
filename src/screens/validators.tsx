/** @jsxImportSource @emotion/react */

import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";
import { Card } from "../components/Card";
import { useState } from "react";
import ValidatorsTable from "../components/validators/ValidatorsTable";
import { useValidators } from "../hooks/useValidators";
import { ValidatorsOrder } from "../services/validatorService";
import { useValidatorsStakeHistory } from "../hooks/useValidatorHistory";
import { ValidatorsStakeHistoryChart } from "../components/validators/ValidatorsStakeHistoryChart";
import { css } from "@emotion/react";

const toggleStyle = css`
	margin-bottom: 20px;
	display: none;
`;

export const ValidatorsPage = () => {
	const validatorsInitialOrder: ValidatorsOrder = "NOMINATOR_RETURN_PER_K_DESC";
	const [validatorsSort, setValidatorsSort] = useState<ValidatorsOrder>(
		validatorsInitialOrder
	);
	const validators = useValidators(validatorsSort);
	const [weightCopiers, setWeightCopiers] = useState(false);
	const validatorsStakeHistory = useValidatorsStakeHistory(weightCopiers);

	useDOMEventTrigger(
		"data-loaded",
		!validators.loading && !validatorsStakeHistory.loading
	);

	return (
		<>
			<Card data-test="validators-history-chart">
				<div css={toggleStyle} className="toggle_btn_block">
					<div className="on-off-toggle">
						<input
							className="on-off-toggle__input"
							type="checkbox"
							id="toggle_switch"
							onChange={(e) => setWeightCopiers(e.target.checked)}
						/>
						<label
							htmlFor="toggle_switch"
							className="on-off-toggle__slider"
						></label>
					</div>
					<span>Weight Copiers</span>
				</div>
				<ValidatorsStakeHistoryChart stakeHistory={validatorsStakeHistory} />
			</Card>
			<Card data-test="validators-table">
				<ValidatorsTable
					validators={validators}
					onSortChange={(sortKey: ValidatorsOrder) =>
						setValidatorsSort(sortKey)
					}
					initialSort={validatorsInitialOrder}
				/>
			</Card>
		</>
	);
};
