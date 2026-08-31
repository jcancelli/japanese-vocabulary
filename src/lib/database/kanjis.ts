// TODO: move db operations into transactions

import type { KanjiDTO } from "$lib/dto.svelte"
import { stripId, type Kanji, type UUIDv4 } from "$lib/model"
import { db, type KanjiData } from "./database"
import { mapKanjiDataToKanjiDTO, mapKanjiToKanjiData } from "./mappings"
import {
	getRelatedKanjiIdsForKanji,
	getRelatedWordIdsForKanji,
	updateKanjiRelationshipsForKanji,
	updateWordRelationshipsForKanji,
} from "./relationships"

export async function getKanji(kanjiId: UUIDv4): Promise<KanjiDTO> {
	return await db.kanjis.get(kanjiId).then(async (kanji) => {
		if (!kanji) {
			throw new Error(`Kanji ${kanjiId} does not exist`)
		}
		return await joinKanjiData(kanji)
	})
}

export async function getKanjis(kanjiIds: UUIDv4[]): Promise<KanjiDTO[]> {
	return await db.kanjis.bulkGet(kanjiIds).then(async (kanji) => {
		if (kanji.includes(undefined)) {
			const missingKanjiIds = kanji
				.map((_, index) => (!kanji ? kanjiIds[index] : null))
				.filter((it) => it !== null)
			throw new Error(`Unable to find kanji(s) with id(s): ${missingKanjiIds.join(", ")}`)
		}
		return await Promise.all((kanji as KanjiData[]).map(joinKanjiData))
	})
}

export async function getAllKanjis(): Promise<KanjiDTO[]> {
	return await db.kanjis
		.toArray()
		.then(async (kanjis) => await Promise.all(kanjis.map(joinKanjiData)))
}

async function joinKanjiData(kanji: KanjiData): Promise<KanjiDTO> {
	const [relatedWords, relatedKanjis] = await Promise.all([
		getRelatedWordIdsForKanji(kanji.id),
		getRelatedKanjiIdsForKanji(kanji.id),
	])
	return mapKanjiDataToKanjiDTO(kanji, relatedKanjis, relatedWords)
}

export async function createKanji(kanji: Kanji): Promise<void> {
	const [kanjiData, kanjiRelationships, wordRelationships] = mapKanjiToKanjiData(kanji)
	await Promise.all([
		db.kanjis.add(kanjiData, kanjiData.id),
		db.relatedKanjis.bulkAdd(kanjiRelationships),
		db.relatedWordsKanjis.bulkAdd(wordRelationships),
	])
}

export async function deleteKanji(kanjiId: UUIDv4): Promise<void> {
	await Promise.all([
		// Delete kanji data
		db.kanjis.delete(kanjiId),
		// Delete kanji relationships
		db.relatedKanjis.where("kanjiId").equals(kanjiId).or("relatedId").equals(kanjiId).delete(),
		// Delete word relationships
		db.relatedWordsKanjis.where("kanjiId").equals(kanjiId).delete(),
	])
}

export async function updateKanji(kanji: Kanji): Promise<void> {
	const [kanjiData] = mapKanjiToKanjiData(kanji)

	await Promise.all([
		db.kanjis.update(kanji.id, stripId(kanjiData)),
		updateWordRelationshipsForKanji(kanji),
		updateKanjiRelationshipsForKanji(kanji),
	])
}

export async function getAllKanjiTags(): Promise<string[]> {
	const kanjis = await db.kanjis.toArray()
	const tags = new Set(kanjis.flatMap((kanji) => kanji.tags))
	return Array.from(tags)
}
