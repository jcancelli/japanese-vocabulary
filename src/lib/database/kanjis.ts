import { KanjiDTO } from "$lib/dto.svelte"
import {
	assertItemIsKanji,
	ItemType,
	stripId,
	type Item,
	type Kanji,
	type UUIDv4,
} from "$lib/model"
import { db, KANJI_TABLES, type KanjiData } from "./database"
import {
	_createItemInternal,
	_deleteItemInternal,
	_getItemDataInternal,
	_getItemDataWithRelationshipsInternal,
	_getItemsDataWithRelationshipsByItemTypeInternal,
	_getItemsDataWithRelationshipsInternal,
	_updateItemInternal,
	type ItemDataWithRelationships,
} from "./items"

export async function getKanji(id: UUIDv4): Promise<KanjiDTO> {
	return await db.transaction("r", KANJI_TABLES, async () => {
		const itemData = await _getItemDataWithRelationshipsInternal(id)
		return _joinKanjiDataInternal(itemData)
	})
}

export async function getKanjis(ids: UUIDv4[]): Promise<KanjiDTO[]> {
	return await db.transaction("r", KANJI_TABLES, async () => {
		const itemsData = await _getItemsDataWithRelationshipsInternal(ids)
		return await Promise.all(itemsData.map(_joinKanjiDataInternal))
	})
}

export async function getAllKanjis(): Promise<KanjiDTO[]> {
	return await db.transaction("r", KANJI_TABLES, async () => {
		const itemsData = await _getItemsDataWithRelationshipsByItemTypeInternal(ItemType.KANJI)
		return await Promise.all(itemsData.map(_joinKanjiDataInternal))
	})
}

export async function createKanji(kanji: Kanji): Promise<void> {
	await db.transaction("rw", KANJI_TABLES, async () => {
		await _createItemInternal(kanji)
		await _createKanjiInternal(kanji)
	})
}

export async function updateKanji(kanji: Kanji): Promise<void> {
	await db.transaction("rw", KANJI_TABLES, async () => {
		await _updateItemInternal(kanji)
		await _updateKanjiInternal(kanji)
	})
}

export async function deleteKanji(id: UUIDv4): Promise<void> {
	await db.transaction("rw", KANJI_TABLES, async () => {
		const item = await _getItemDataInternal(id)
		if (item.itemType !== ItemType.KANJI) {
			throw new Error(`Cannot delete kanji ${id}. Not a kanji.`)
		}
		await _deleteItemInternal(id)
		await _deleteKanjiInternal(id)
	})
}

export function mapKanjiToData(kanji: Kanji): KanjiData {
	return {
		id: kanji.id,
		kanji: kanji.kanji,
		onyomi: Array.from(kanji.onyomi),
		kunyomi: Array.from(kanji.kunyomi),
		nanori: Array.from(kanji.nanori),
	}
}

export async function _createKanjiInternal(item: Item): Promise<void> {
	await db.transaction("rw", KANJI_TABLES, async (tx) => {
		assertItemIsKanji(item)
		const kanjiData = mapKanjiToData(item)
		await tx.kanjis.add(kanjiData, kanjiData.id)
	})
}

export async function _updateKanjiInternal(item: Item): Promise<void> {
	await db.transaction("rw", KANJI_TABLES, async (tx) => {
		assertItemIsKanji(item)
		const kanjiData = mapKanjiToData(item)
		await tx.kanjis.update(kanjiData.id, stripId(kanjiData))
	})
}

export async function _deleteKanjiInternal(id: UUIDv4): Promise<void> {
	await db.transaction("rw", KANJI_TABLES, async (tx) => {
		await tx.kanjis.delete(id)
	})
}

export async function _joinKanjiDataInternal(item: ItemDataWithRelationships): Promise<KanjiDTO> {
	return await db.transaction("r", KANJI_TABLES, async () => {
		const kanji = await _getKanjiDataInternal(item.id)
		return new KanjiDTO(
			item.id,
			kanji.kanji,
			kanji.onyomi,
			kanji.kunyomi,
			kanji.nanori,
			item.meanings,
			item.jlptLevel,
			item.difficulty,
			item.lastStudiedAt,
			item.tags,
			item.relatedWords,
			item.relatedKanjis,
			item.relatedCounters,
		)
	})
}

async function _getKanjiDataInternal(id: UUIDv4): Promise<KanjiData> {
	const kanjiData = await db.kanjis.get(id)
	if (!kanjiData) {
		throw new Error(`Kanji ${id} does not exist`)
	}
	return kanjiData
}
