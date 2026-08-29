import type { WordDTO } from "$lib/dto.svelte"
import { wordStudySessionLocalStorage, WordStudySessionStep } from "$lib/study_session"
import type { LayoutLoad } from "./$types"

export const load: LayoutLoad = async () => {
	return {
		params: wordStudySessionLocalStorage.params,
		words: [] as WordDTO[],
		step: WordStudySessionStep.CONFIGURE,
	}
}
