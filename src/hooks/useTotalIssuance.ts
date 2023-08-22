import Decimal from "decimal.js";
import { useEffect, useState } from "react";
import { useApi } from "../contexts";
import { rawAmountToDecimal } from "../utils/number";

export function useTotalIssuance() {
    const {
        state: { api, apiState },
    } = useApi();
    const [totalIssuance, setTotalIssuance] = useState<Decimal>();
    const [unsub, setUnsub] = useState<any>(undefined);

    const subscribeTotalIssuance = async () => {
        if (!api || apiState !== "READY") return;
        const _unsub = await api.query.subtensorModule?.totalIssuance(
            (value: any) => {
                console.log(value.toString());
                value && setTotalIssuance(rawAmountToDecimal(value.toString()));
            }
        );
        setUnsub(_unsub);
    };

    useEffect(() => {
        subscribeTotalIssuance();
    }, [apiState]);

    return totalIssuance;
}
