import type { VocabularyItemDTO } from "$lib/dto.svelte"
import { stripId, VocabularyItemType, type UUIDv4, type VocabularyItem } from "$lib/model"
import {
	_createCounterInternal,
	_deleteCounterInternal,
	_updateCounterInternal,
	joinCounterData,
} from "./counters"
import {
	db,
	VOCABULARY_ITEM_TABLES,
	type ItemRelationshipData,
	type VocabularyItemData,
} from "./database"
import {
	_createKanjiInternal,
	_deleteKanjiInternal,
	_updateKanjiInternal,
	joinKanjiData,
} from "./kanjis"
import { mapVocabularyItemToData } from "./mappings"
import {
	getRelatedCountersIdsForVocabularyItem,
	getRelatedKanjisIdsForVocabularyItem,
	getRelatedWordsIdsForVocabularyItem,
	updateVocabularyItemRelationships,
} from "./relationships"
import {
	_createWordInternal,
	_deleteWordInternal,
	_updateWordInternal,
	joinWordData,
} from "./words"

export async function getAllVocabularyItemsTags(): Promise<string[]> {
	const items = await db.items.toArray()
	const tags = new Set(items.flatMap((item) => item.tags))
	return Array.from(tags)
}

export async function getVocabularyItem(itemId: UUIDv4): Promise<VocabularyItemDTO> {
	return await db.transaction("r", VOCABULARY_ITEM_TABLES, async (tx) => {
		const item = await tx.items.get(itemId)
		if (!item) {
			throw new Error(`Vocabulary item ${itemId} not found`)
		}
		return joinVocabularyItemData(item)
	})
}

export async function getVocabularyItems(itemIds: UUIDv4[]): Promise<VocabularyItemDTO[]> {
	return await db.transaction("r", VOCABULARY_ITEM_TABLES, async (tx) => {
		const items = await tx.items.bulkGet(itemIds)
		if (items.includes(undefined)) {
			const missingIds = items
				.map((item, index) => (!item ? itemIds[index] : null))
				.filter((it) => it !== null)
			throw new Error(
				`Unable to find vocabulary item(s) with id(s): ${missingIds.join(", ")}`,
			)
		}
		return await Promise.all((items as VocabularyItemData[]).map(joinVocabularyItemData))
	})
}

export async function getAllVocabularyItems(): Promise<VocabularyItemDTO[]> {
	return await db.transaction("r", VOCABULARY_ITEM_TABLES, async (tx) => {
		const items = await tx.items.toArray()
		return await Promise.all(items.map(joinVocabularyItemData))
	})
}

export async function joinVocabularyItemData(item: VocabularyItemData): Promise<VocabularyItemDTO> {
	return await db.transaction("r", VOCABULARY_ITEM_TABLES, async () => {
		const [relatedWords, relatedKanjis, relatedCounters] = await Promise.all([
			getRelatedWordsIdsForVocabularyItem(item.id),
			getRelatedKanjisIdsForVocabularyItem(item.id),
			getRelatedCountersIdsForVocabularyItem(item.id),
		])

		switch (item.itemType) {
			case VocabularyItemType.WORD:
				const word = await db.words.get(item.id)
				if (!word) {
					throw new Error(
						`Word data associated with vocabulary item ${item.id} was not found`,
					)
				}
				return await joinWordData(item, relatedWords, relatedKanjis, relatedCounters, word)

			case VocabularyItemType.KANJI:
				const kanji = await db.kanjis.get(item.id)
				if (!kanji) {
					throw new Error(
						`Kanji data associated with vocabulary item ${item.id} was not found`,
					)
				}
				return await joinKanjiData(
					item,
					relatedWords,
					relatedKanjis,
					relatedCounters,
					kanji,
				)

			case VocabularyItemType.COUNTER:
				const counter = await db.counters.get(item.id)
				if (!counter) {
					throw new Error(
						`Counter data associated with vocabulary item ${item.id} was not found`,
					)
				}
				return await joinCounterData(
					item,
					relatedWords,
					relatedKanjis,
					relatedCounters,
					counter,
				)

			default:
				throw new Error(
					`Unexpected vocabulary item type ${item.itemType} while joining vocabulary item data`,
				)
		}
	})
}

export async function createVocabularyItem(item: VocabularyItem): Promise<void> {
	const [
		itemData,
		relationshipsData,
		wordData,
		simpleWordData,
		verbData,
		adjectiveData,
		kanjiData,
		counterData,
	] = mapVocabularyItemToData(item)

	await db.transaction("rw", VOCABULARY_ITEM_TABLES, async () => {
		await _createVocabularyItemInternal(itemData, relationshipsData)

		switch (item.itemType) {
			case VocabularyItemType.WORD:
				if (!wordData) {
					throw new Error("Creating word but no word data was provided")
				}
				await _createWordInternal(wordData, simpleWordData, verbData, adjectiveData)
				break

			case VocabularyItemType.KANJI:
				if (!kanjiData) {
					throw new Error("Creating kanji but no kanji data was provided")
				}
				await _createKanjiInternal(kanjiData)
				break

			case VocabularyItemType.COUNTER:
				if (!counterData) {
					throw new Error("Creating counter but no counter data was provided")
				}
				await _createCounterInternal(counterData)
				break

			default:
				throw new Error(
					`Creating vocabulary item with unknown itemType: ${itemData.itemType}`,
				)
		}
	})
}

export async function updateVocabularyItem(item: VocabularyItem): Promise<void> {
	const [
		itemData,
		relationshipsData,
		wordData,
		simpleWordData,
		verbData,
		adjectiveData,
		kanjiData,
		counterData,
	] = mapVocabularyItemToData(item)

	await db.transaction("rw", VOCABULARY_ITEM_TABLES, async () => {
		await _updateVocabularyItemInternal(itemData, relationshipsData)

		switch (itemData.itemType) {
			case VocabularyItemType.WORD:
				if (!wordData) {
					throw new Error("Updating word but no word data was provided")
				}
				await _updateWordInternal(wordData, simpleWordData, verbData, adjectiveData)
				break

			case VocabularyItemType.KANJI:
				if (!kanjiData) {
					throw new Error("Updating kanji but no kanji data was provided")
				}
				await _updateKanjiInternal(kanjiData)
				break

			case VocabularyItemType.COUNTER:
				if (!counterData) {
					throw new Error("Updating counter but no counter data was provided")
				}
				await _updateCounterInternal(counterData)
				break

			default:
				throw new Error(`Updating vocabulary item with unknown itemType: ${item.itemType}`)
		}
	})
}

export async function deleteVocabularyItem(itemId: UUIDv4): Promise<void> {
	await db.transaction("rw", VOCABULARY_ITEM_TABLES, async (tx) => {
		const item = await tx.items.get(itemId)
		if (!item) {
			throw new Error(`Cannot find item to delete, id ${itemId}`)
		}

		await _deleteVocabularyItemInternal(itemId)

		switch (item.itemType) {
			case VocabularyItemType.WORD:
				await _deleteWordInternal(itemId)
				break

			case VocabularyItemType.KANJI:
				await _deleteKanjiInternal(itemId)
				break

			case VocabularyItemType.COUNTER:
				await _deleteCounterInternal(itemId)
				break

			default:
				throw new Error(`Deleting vocabulary item with unknown itemType: ${item.itemType}`)
		}
	})
}

/** Only create the base item and its relationships */
export async function _createVocabularyItemInternal(
	itemData: VocabularyItemData,
	relationshipsData: ItemRelationshipData[],
): Promise<void> {
	await db.transaction("rw", ["items", "itemRelationships"], async (tx) => {
		await tx.items.add(itemData, itemData.id)
		await tx.itemRelationships.bulkAdd(relationshipsData)
	})
}

/** Only update the base item and its relationships */
export async function _updateVocabularyItemInternal(
	itemData: VocabularyItemData,
	relationshipsData: ItemRelationshipData[],
): Promise<void> {
	await db.transaction("rw", ["items", "itemRelationships"], async (tx) => {
		await tx.items.update(itemData.id, stripId(itemData))
		await updateVocabularyItemRelationships(relationshipsData) // TODO: reiplement updateVocabularyItemRelationships
	})
}

/** Only delete the base item and its relationhips */
export async function _deleteVocabularyItemInternal(itemId: UUIDv4): Promise<void> {
	await db.transaction("rw", ["items", "itemRelationships"], async (tx) => {
		await tx.items.delete(itemId)
		await tx.itemRelationships
			.where("itemId")
			.equals(itemId)
			.or("relatedId")
			.equals(itemId)
			.delete()
	})
}
