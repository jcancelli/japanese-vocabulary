import { getWord } from "$lib/database/words"
import { UUIDv4Schema } from "$lib/schema"
import { error } from "@sveltejs/kit"
import type { LayoutLoad } from "./$types"
import { getRelatedKanjisForWord, getRelatedWordsForWord } from "$lib/database/relationships"

export const ssr = false

export const load: LayoutLoad = async ({ params }) => {
	try {
		const wordId = UUIDv4Schema.parse(params.wordId)
		const word = await getWord(wordId)
		const relatedWords = await getRelatedWordsForWord(wordId)
		const relatedKanjis = await getRelatedKanjisForWord(wordId)
		return {
			word,
			relatedWords,
			relatedKanjis,
		}
	} catch (err: any) {
		error(404, err)
	}
}
