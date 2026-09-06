import type { KanjiDTO, WordDTO } from "$lib/dto.svelte"
import { VocabularyItemType, type UUIDv4, type VocabularyItem } from "$lib/model"
import { db } from "./database"
import { getKanjis } from "./kanjis"
import { getWords } from "./words"

export async function getRelatedWordsIdsForVocabularyItem(itemId: UUIDv4): Promise<UUIDv4[]> {
	return await db.itemRelationships
		.where("itemId")
		.equals(itemId)
		.and(({ relatedType }) => relatedType === VocabularyItemType.WORD)
		.toArray()
		.then((results) => results.map(({ relatedId }) => relatedId))
}

export async function getRelatedKanjisIdsForVocabularyItem(itemId: UUIDv4): Promise<UUIDv4[]> {
	return await db.itemRelationships
		.where("itemId")
		.equals(itemId)
		.and(({ relatedType }) => relatedType === VocabularyItemType.KANJI)
		.toArray()
		.then((results) => results.map(({ relatedId }) => relatedId))
}

export async function getRelatedCountersIdsForVocabularyItem(itemId: UUIDv4): Promise<UUIDv4[]> {
	return await db.itemRelationships
		.where("itemId")
		.equals(itemId)
		.and(({ relatedType }) => relatedType === VocabularyItemType.COUNTER)
		.toArray()
		.then((results) => results.map(({ relatedId }) => relatedId))
}

export async function getRelatedVocabularyItemsIdsForVocabularyItem(
	itemId: UUIDv4,
): Promise<UUIDv4[]> {
	return await db.itemRelationships
		.where("itemId")
		.equals(itemId)
		.toArray()
		.then((results) => results.map(({ relatedId }) => relatedId))
}

export async function getRelatedWordsForVocabularyItem(itemId: UUIDv4): Promise<WordDTO[]> {
	const wordsIds = await getRelatedWordsIdsForVocabularyItem(itemId)
	return await getWords(wordsIds)
}

export async function getRelatedKanjisForVocabularyItem(itemId: UUIDv4): Promise<KanjiDTO[]> {
	const kanjisIds = await getRelatedKanjisIdsForVocabularyItem(itemId)
	return await getKanjis(kanjisIds)
}

export async function getRelatedCountersForVocabularyItem(itemId: UUIDv4): Promise<WordDTO[]> {
	const countersIds = await getRelatedCountersIdsForVocabularyItem(itemId)
	return await getCounters(countersIds)
}

export async function getRelatedVocabularyItemsForVocabularyItem(
	itemId: UUIDv4,
): Promise<WordDTO[]> {
	const itemsIds = await getRelatedVocabularyItemsIdsForVocabularyItem(itemId)
	return await getVocabularyItems(itemsIds)
}

export async function updateVocabularyItemRelationships(item: VocabularyItem): Promise<void> {
	await db.transaction("rw", ["itemRelationships"], async () => {
		// Related words
		await updateVocabularyItemRelationshipsByRelatedType(
			item.id,
			VocabularyItemType.WORD,
			await getRelatedWordsIdsForVocabularyItem(item.id),
			item.relatedWords,
		)
		// Related kanjis
		await updateVocabularyItemRelationshipsByRelatedType(
			item.id,
			VocabularyItemType.KANJI,
			await getRelatedKanjisIdsForVocabularyItem(item.id),
			item.relatedKanjis,
		)
		// Related counters
		await updateVocabularyItemRelationshipsByRelatedType(
			item.id,
			VocabularyItemType.COUNTER,
			await getRelatedCountersIdsForVocabularyItem(item.id),
			item.relatedCounters,
		)
	})
}

async function updateVocabularyItemRelationshipsByRelatedType(
	itemId: UUIDv4,
	relatedType: VocabularyItemType,
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
