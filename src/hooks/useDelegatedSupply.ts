import Decimal from "decimal.js";
import { useEffect, useState } from "react";
import { useApi } from "../contexts";

export function useDelegatedSupply() {
    const [delegated, setDelegated] = useState<Decimal>();
    const { state: { api } } = useApi();

    useEffect(() => {
        const fetchDelegatedSupply = async () => {
            if (!api || !api.isReady) return;
            const res_bytes = await api.rpc.delegateInfo.getDelegates();
            if (res_bytes.isEmpty) {
                console.log("Failed to get delegates");
                return;
            }
            const res = api.createType("Vec<DelegateInfo>", res_bytes);
            const data = res.toJSON();

            const sum = data.reduce(
                (sum: number, current: any) =>
                    sum + current.nominators.reduce((total: number, item: any) => total + item[1], 0),
                0
            );
            setDelegated(sum);
        };
        fetchDelegatedSupply();
    }, [api]);

    return delegated;
}