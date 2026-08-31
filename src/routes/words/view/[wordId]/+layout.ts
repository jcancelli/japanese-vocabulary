import { getWord } from "$lib/database/words"
import { UUIDv4Schema } from "$lib/schema"
import { error } from "@sveltejs/kit"
import type { LayoutLoad } from "./$types"
import { browser } from "$app/env"
import { getRelatedWordsForWord } from "$lib/database/relationships"

export const load: LayoutLoad = async ({ params }) => {
	// TODO: find out if you can get rid of this !browser (maybe by exporting ssr = false ?)
	if (!browser) {
		return
	}
	try {
		const wordId = UUIDv4Schema.parse(params.wordId)
		const word = await getWord(wordId)
		const relatedWords = await getRelatedWordsForWord(wordId)
		return {
			word,
			relatedWords,
		}
	} catch (err: any) {
		error(404)
	}
}
