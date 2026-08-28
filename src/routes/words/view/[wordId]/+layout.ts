import { getWord } from "$lib/database"
import { UUIDv4Schema } from "$lib/schema"
import { error } from "@sveltejs/kit"
import type { LayoutLoad } from "./$types"

export const ssr = false
export const prerender = false

export const load: LayoutLoad = async ({ params }) => {
	try {
		const wordId = UUIDv4Schema.parse(params.wordId)
		const word = await getWord(wordId)
		return {
			word,
		}
	} catch (err: any) {
		error(404)
	}
}
