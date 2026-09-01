import type { KanjiDTO } from "$lib/dto.svelte"
import { storage } from "$lib/local_storage"
import { StudySessionStep } from "$lib/study_session"
import type { LayoutLoad } from "./$types"

export const ssr = false

export const load: LayoutLoad = async () => {
	return {
		params: storage.kanjiStudySession.params,
		kanjis: [] as KanjiDTO[],
		step: StudySessionStep.CONFIGURE,
	}
}
