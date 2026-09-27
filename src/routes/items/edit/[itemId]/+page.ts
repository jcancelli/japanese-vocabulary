import { UUIDv4Schema } from "$lib/schema"
import { error } from "@sveltejs/kit"
import type { PageLoad } from "./$types"
import { getItem } from "$lib/database/items"

export const ssr = false

export const load: PageLoad = async ({ params }) => {
	try {
		const itemId = UUIDv4Schema.parse(params.itemId)
		const item = await getItem(itemId)
		return {
			item,
		}
	} catch (err: any) {
		error(404, err)
	}
}
