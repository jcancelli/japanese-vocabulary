import type { KanjiDTO, WordDTO } from "$lib/dto.svelte"
import { ItemType, type UUIDv4, type Item, type WithRelationships } from "$lib/model"
import {
	db,
	WORD_TABLES,
	KANJI_TABLES,
	COUNTER_TABLES,
	type ItemRelationshipData,
} from "./database"
import { getKanjis } from "./kanjis"
import { getWords } from "./words"
import { getCounters } from "./counters"

export async function getRelatedWordsIdsForItem(itemId: UUIDv4): Promise<UUIDv4[]> {
	return await db.itemRelationships
		.where("itemId")
		.equals(itemId)
		.and(({ relatedType }) => relatedType === ItemType.WORD)
		.toArray()
		.then((results) => results.map(({ relatedId }) => relatedId))
}

export async function getRelatedKanjisIdsForItem(itemId: UUIDv4): Promise<UUIDv4[]> {
	return await db.itemRelationships
		.where("itemId")
		.equals(itemId)
		.and(({ relatedType }) => relatedType === ItemType.KANJI)
		.toArray()
		.then((results) => results.map(({ relatedId }) => relatedId))
}

export async function getRelatedCountersIdsForItem(itemId: UUIDv4): Promise<UUIDv4[]> {
	return await db.itemRelationships
		.where("itemId")
		.equals(itemId)
		.and(({ relatedType }) => relatedType === ItemType.COUNTER)
		.toArray()
		.then((results) => results.map(({ relatedId }) => relatedId))
}

export async function getRelatedItemsIdsItem(itemId: UUIDv4): Promise<{
	relatedWords: UUIDv4[]
	relatedKanjis: UUIDv4[]
	relatedCounters: UUIDv4[]
}> {
	return await db.transaction("r", ["itemRelationships"], async () => {
		const [relatedWords, relatedKanjis, relatedCounters] = await Promise.all([
			getRelatedWordsIdsForItem(itemId),
			getRelatedKanjisIdsForItem(itemId),
			getRelatedCountersIdsForItem(itemId),
		])
		return {
			relatedWords,
			relatedKanjis,
			relatedCounters,
		}
	})
}

export async function getRelatedWordsForItem(itemId: UUIDv4): Promise<WordDTO[]> {
	return await db.transaction("r", WORD_TABLES, async () => {
		const wordsIds = await getRelatedWordsIdsForItem(itemId)
		return await getWords(wordsIds)
	})
}

export async function getRelatedKanjisForItem(itemId: UUIDv4): Promise<KanjiDTO[]> {
	return await db.transaction("r", KANJI_TABLES, async () => {
		const kanjisIds = await getRelatedKanjisIdsForItem(itemId)
		return await getKanjis(kanjisIds)
	})
}

export async function getRelatedCountersForItem(itemId: UUIDv4): Promise<WordDTO[]> {
	return await db.transaction("r", COUNTER_TABLES, async () => {
		const countersIds = await getRelatedCountersIdsForItem(itemId)
		return await getCounters(countersIds)
	})
}

export async function updateItemRelationships(item: WithRelationships): Promise<void> {
	await db.transaction("rw", ["itemRelationships"], async () => {
		const { relatedWords, relatedKanjis, relatedCounters } = await getRelatedItemsIdsItem(
			item.id,
		)
		// Related words
		await _updateVocabularyItemRelationshipsByRelatedType(
			item.id,
			ItemType.WORD,
			relatedWords,
			item.relatedWords,
		)
		// Related kanjis
		await _updateVocabularyItemRelationshipsByRelatedType(
			item.id,
			ItemType.KANJI,
			relatedKanjis,
			item.relatedKanjis,
		)
		// Related counters
		await _updateVocabularyItemRelationshipsByRelatedType(
			item.id,
			ItemType.COUNTER,
			relatedCounters,
			item.relatedCounters,
		)
	})
}

export function mapItemToItemRelationships(item: Item): ItemRelationshipData[] {
	const wordsRelationships: ItemRelationshipData[] = item.relatedWords.flatMap((relatedId) => [
		{ itemId: item.id, relatedId, relatedType: ItemType.WORD },
		{ itemId: relatedId, relatedId: item.id, relatedType: item.itemType },
	])
	const kanjisRelationships: ItemRelationshipData[] = item.relatedKanjis.flatMap((relatedId) => [
		{ itemId: item.id, relatedId, relatedType: ItemType.KANJI },
		{ itemId: relatedId, relatedId: item.id, relatedType: item.itemType },
	])
	const countersRelationships: ItemRelationshipData[] = item.relatedCounters.flatMap(
		(relatedId) => [
			{ itemId: item.id, relatedId, relatedType: ItemType.COUNTER },
			{ itemId: relatedId, relatedId: item.id, relatedType: item.itemType },
		],
	)
	const relationshipsData = wordsRelationships
		.concat(kanjisRelationships)
		.concat(countersRelationships)
	return relationshipsData
}

/** Input is assumed to be only relationships with the same itemId */
export function mapItemRelationshipsDataToIds(relationshipsData: ItemRelationshipData[]): {
	relatedWords: UUIDv4[]
	relatedKanjis: UUIDv4[]
	relatedCounters: UUIDv4[]
} {
	const relatedWords: UUIDv4[] = []
	const relatedKanjis: UUIDv4[] = []
	const relatedCounters: UUIDv4[] = []
	for (const { relatedId, relatedType } of relationshipsData) {
		switch (relatedType) {
			case ItemType.WORD:
				relatedWords.push(relatedId)
				break
			case ItemType.KANJI:
				relatedKanjis.push(relatedId)
				break
			case ItemType.COUNTER:
				relatedCounters.push(relatedId)
				break
			default:
				throw new Error(
					`Item relationship with unexpected relatedType found: ${relatedType}`,
				)
		}
	}
	return { relatedWords, relatedKanjis, relatedCounters }
}

async function _updateVocabularyItemRelationshipsByRelatedType(
	itemId: UUIDv4,
	relatedType: ItemType,
	oldRelatedIds: UUIDv4[],
	newRelatedIds: UUIDv4[],
): Promise<void> {
	const oldIds = new Set(oldRelatedIds)
	const newIds = new Set(newRelatedIds)
	const toDelete = oldIds.difference(newIds)
	const toCreate = Array.from(newIds.difference(oldIds))
	await db.transaction("rw", ["itemRelationships"], async (tx) => {
		// Delete removed relationships
		await tx.itemRelationships
			.where("itemId")
			.equals(itemId)
			.and(({ relatedId }) => toDelete.has(relatedId))
			.delete()
		// Create new relationships
		await tx.itemRelationships.bulkAdd(
			toCreate.flatMap((id) => {
				return [
					{ itemId: itemId, relatedId: id, relatedType },
					{ itemId: id, relatedId: itemId, relatedType },
				]
			}),
		)
	})
}
