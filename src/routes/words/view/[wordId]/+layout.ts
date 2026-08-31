import { getWord } from "$lib/database/words"
import { UUIDv4Schema } from "$lib/schema"
import { error } from "@sveltejs/kit"
import type { LayoutLoad } from "./$types"
import { getRelatedWordsForWord } from "$lib/database/relationships"

export const ssr = false

export const load: LayoutLoad = async ({ params }) => {
	try {
		const wordId = UUIDv4Schema.parse(params.wordId)
		const word = await getWord(wordId)
		const relatedWords = await getRelatedWordsForWord(wordId)
		return {
			word,
			relatedWords,
		}
	} catch (err: any) {
		error(404, err)
	}
}
