import { error } from "@sveltejs/kit"
import { getAllItems } from "$lib/database/items"
import type { PageLoad } from "./$types"

export const ssr = false

export const load: PageLoad = async () => {
	try {
		const items = await getAllItems()
		return {
			items,
		}
	} catch (err: any) {
		error(500, err)
	}
}
