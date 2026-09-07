import type { KanjiDTO, WordDTO } from "$lib/dto.svelte"
import { VocabularyItemType, type UUIDv4 } from "$lib/model"
import { db, WORD_TABLES, KANJI_TABLES, COUNTER_TABLES } from "./database"
import { getKanjis } from "./kanjis"
import { getWords } from "./words"
import { getCounters } from "./counters"

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

export async function getRelatedVocabularyItemsIdsForVocabularyItem(itemId: UUIDv4): Promise<{
	relatedWords: UUIDv4[]
	relatedKanjis: UUIDv4[]
	relatedCounters: UUIDv4[]
}> {
	return await db.transaction("r", ["itemRelationships"], async () => {
		const [relatedWords, relatedKanjis, relatedCounters] = await Promise.all([
			getRelatedWordsIdsForVocabularyItem(itemId),
			getRelatedKanjisIdsForVocabularyItem(itemId),
			getRelatedCountersIdsForVocabularyItem(itemId),
		])
		return {
			relatedWords,
			relatedKanjis,
			relatedCounters,
		}
	})
}

export async function getRelatedWordsForVocabularyItem(itemId: UUIDv4): Promise<WordDTO[]> {
	return await db.transaction("r", WORD_TABLES, async () => {
		const wordsIds = await getRelatedWordsIdsForVocabularyItem(itemId)
		return await getWords(wordsIds)
	})
}

export async function getRelatedKanjisForVocabularyItem(itemId: UUIDv4): Promise<KanjiDTO[]> {
	return await db.transaction("r", KANJI_TABLES, async () => {
		const kanjisIds = await getRelatedKanjisIdsForVocabularyItem(itemId)
		return await getKanjis(kanjisIds)
	})
}

export async function getRelatedCountersForVocabularyItem(itemId: UUIDv4): Promise<WordDTO[]> {
	return await db.transaction("r", COUNTER_TABLES, async () => {
		const countersIds = await getRelatedCountersIdsForVocabularyItem(itemId)
		return await getCounters(countersIds)
	})
}

export async function updateVocabularyItemRelationships(item: {
	id: UUIDv4
	relatedWords: UUIDv4[]
	relatedKanjis: UUIDv4[]
	relatedCounters: UUIDv4[]
}): Promise<void> {
	await db.transaction("rw", ["itemRelationships"], async () => {
		const { relatedWords, relatedKanjis, relatedCounters } =
			await getRelatedVocabularyItemsIdsForVocabularyItem(item.id)
		// Related words
		await _updateVocabularyItemRelationshipsByRelatedType(
			item.id,
			VocabularyItemType.WORD,
			relatedWords,
			item.relatedWords,
		)
		// Related kanjis
		await _updateVocabularyItemRelationshipsByRelatedType(
			item.id,
			VocabularyItemType.KANJI,
			relatedKanjis,
			item.relatedKanjis,
		)
		// Related counters
		await _updateVocabularyItemRelationshipsByRelatedType(
			item.id,
			VocabularyItemType.COUNTER,
			relatedCounters,
			item.relatedCounters,
		)
	})
}

async function _updateVocabularyItemRelationshipsByRelatedType(
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
