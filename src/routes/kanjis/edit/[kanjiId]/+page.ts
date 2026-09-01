import { error } from "@sveltejs/kit"
import type { PageLoad } from "./$types"
import { UUIDv4Schema } from "$lib/schema"
import { getKanji } from "$lib/database/kanjis"

export const ssr = false

export const load: PageLoad = async ({ params }) => {
	try {
		const kanjiId = UUIDv4Schema.parse(params.kanjiId)
		const kanji = await getKanji(kanjiId)
		return {
			kanji,
		}
	} catch (err: any) {
		error(404, err)
	}
}
