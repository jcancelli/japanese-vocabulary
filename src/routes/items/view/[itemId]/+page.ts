import { UUIDv4Schema } from "$lib/schema"
import { error } from "@sveltejs/kit"
import type { PageLoad } from "./$types"
import { getItem } from "$lib/database/items"
import {
	getRelatedWordsForItem,
	getRelatedKanjisForItem,
	getRelatedCountersForItem,
} from "$lib/database/relationships"

export const ssr = false

export const load: PageLoad = async ({ params }) => {
	try {
		const itemId = UUIDv4Schema.parse(params.itemId)
		const [item, relatedWords, relatedKanjis, relatedCounters] = await Promise.all([
			getItem(itemId),
			getRelatedWordsForItem(itemId),
			getRelatedKanjisForItem(itemId),
			getRelatedCountersForItem(itemId),
		])
		return {
			item,
			relatedWords,
			relatedKanjis,
			relatedCounters,
		}
	} catch (err: any) {
		error(404, err)
	}
}
