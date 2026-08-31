import { getAllWords } from "$lib/database/words"
import { error } from "@sveltejs/kit"
import type { PageLoad } from "./$types"

export const ssr = false

export const load: PageLoad = async () => {
	try {
		const words = await getAllWords()
		return {
			words,
		}
	} catch (err: any) {
		error(500, err)
	}
}
