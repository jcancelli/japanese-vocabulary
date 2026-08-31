import { error } from "@sveltejs/kit"
import type { PageLoad } from "./$types"
import { getAllKanjis } from "$lib/database/kanjis"

export const ssr = false

export const load: PageLoad = async () => {
	try {
		const kanjis = await getAllKanjis()
		return {
			kanjis,
		}
	} catch (err: any) {
		error(500, err)
	}
}
