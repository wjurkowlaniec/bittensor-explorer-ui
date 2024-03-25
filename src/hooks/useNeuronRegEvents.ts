import { FetchOptions } from "../model/fetchOptions";
import {
	NeuronRegEventsFilter,
	NeuronRegEventsOrder,
	getNeuronRegEvents,
} from "../services/subnetsService";

import { usePaginatedResource } from "./usePaginatedResource";

export function useNeuronRegEvents(
	filter: NeuronRegEventsFilter | undefined,
	order?: NeuronRegEventsOrder,
	options?: FetchOptions
) {
	return usePaginatedResource(getNeuronRegEvents, [filter, order], options);
}
