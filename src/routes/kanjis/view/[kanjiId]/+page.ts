import { UUIDv4Schema } from "$lib/schema"
import { error } from "@sveltejs/kit"
import type { PageLoad } from "./$types"
import { getKanji } from "$lib/database/kanjis"
import { getRelatedKanjisForKanji, getRelatedWordsForKanji } from "$lib/database/relationships"

export const ssr = false

export const load: PageLoad = async ({ params }) => {
	try {
		const kanjiId = UUIDv4Schema.parse(params.kanjiId)
		const kanji = await getKanji(kanjiId)
		const relatedWords = await getRelatedWordsForKanji(kanjiId)
		const relatedKanjis = await getRelatedKanjisForKanji(kanjiId)
		return {
			kanji,
			relatedWords,
			relatedKanjis,
		}
	} catch (err: any) {
		error(404, err)
	}
}
