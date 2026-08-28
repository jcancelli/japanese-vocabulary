import { error } from "@sveltejs/kit"
import type { PageLoad } from "./$types"
import { UUIDv4Schema } from "$lib/schema"
import { getWord } from "$lib/database"

export const ssr = false
export const prerender = false

export const load: PageLoad = async ({ params }) => {
	try {
		const wordId = UUIDv4Schema.parse(params.wordId)
		const word = await getWord(wordId)
		return {
			word,
		}
	} catch (err: any) {
		error(404, err)
	}
}
