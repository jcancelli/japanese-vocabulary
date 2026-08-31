import type { KanjiDTO, WordDTO } from "$lib/dto.svelte"
import type { UUIDv4 } from "$lib/model"
import { db } from "./database"
import { getKanjis } from "./kanjis"
import { getWords } from "./words"

export async function getRelatedWordIdsForWord(id: UUIDv4): Promise<UUIDv4[]> {
	return await db.relatedWords
		.where("wordId")
		.equals(id)
		.toArray()
		.then((relationships) => relationships.map(({ relatedId }) => relatedId))
}

export async function getRelatedKanjiIdsForWord(id: UUIDv4): Promise<UUIDv4[]> {
	return await db.relatedWordsKanjis
		.where("wordId")
		.equals(id)
		.toArray()
		.then((relationships) => relationships.map(({ kanjiId }) => kanjiId))
}

export async function getRelatedWordIdsForKanji(id: UUIDv4): Promise<UUIDv4[]> {
	return await db.relatedWordsKanjis
		.where("kanjiId")
		.equals(id)
		.toArray()
		.then((relationships) => relationships.map(({ wordId }) => wordId))
}

export async function getRelatedKanjiIdsForKanji(id: UUIDv4): Promise<UUIDv4[]> {
	return await db.relatedKanjis
		.where("kanjiId")
		.equals(id)
		.toArray()
		.then((relationships) => relationships.map(({ relatedId }) => relatedId))
}

export async function getRelatedWordsForWord(wordId: UUIDv4): Promise<WordDTO[]> {
	const wordIds = await getRelatedWordIdsForWord(wordId)
	return await getWords(wordIds)
}

export async function getRelatedKanjisForWord(id: UUIDv4): Promise<KanjiDTO[]> {
	const kanjiIds = await getRelatedKanjiIdsForWord(id)
	return await getKanjis(kanjiIds)
}

export async function getRelatedWordsForKanji(kanjiId: UUIDv4): Promise<WordDTO[]> {
	const wordIds = await getRelatedWordIdsForKanji(kanjiId)
	return await getWords(wordIds)
}

export async function getRelatedKanjisForKanji(id: UUIDv4): Promise<KanjiDTO[]> {
	const kanjiIds = await getRelatedKanjiIdsForKanji(id)
	return await getKanjis(kanjiIds)
}
