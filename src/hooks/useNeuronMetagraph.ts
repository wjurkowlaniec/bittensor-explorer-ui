import { FetchOptions } from "../model/fetchOptions";
import {
	NeuronMetagraphFilter,
	NeuronMetagraphOrder,
	getNeuronMetagraph,
} from "../services/subnetsService";

import { usePaginatedResource } from "./usePaginatedResource";

export function useNeuronMetagraph(
	filter: NeuronMetagraphFilter | undefined,
	order?: NeuronMetagraphOrder,
	options?: FetchOptions
) {
	return usePaginatedResource(getNeuronMetagraph, [filter, order], options, 25);
}
