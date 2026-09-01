import type { WordDTO } from "$lib/dto.svelte"
import { storage } from "$lib/local_storage"
import { WordStudySessionStep } from "$lib/study_session"
import type { LayoutLoad } from "./$types"

export const load: LayoutLoad = async () => {
	return {
		params: storage.wordStudySession.params,
		words: [] as WordDTO[],
		step: WordStudySessionStep.CONFIGURE,
	}
}
