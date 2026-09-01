import type { KanjiDTO, WordDTO } from "$lib/dto.svelte"
import type { Kanji, UUIDv4, Word } from "$lib/model"
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

export async function updateWordRelationshipsForWord(word: Word): Promise<void> {
	const oldRelatedWordsIds = new Set(await getRelatedWordIdsForWord(word.id))
	const newRelatedWordsIds = new Set(word.relatedWords)
	const relationshipsToCreateIds = Array.from(newRelatedWordsIds.difference(oldRelatedWordsIds))
	const relationshipsToDeleteIds = Array.from(oldRelatedWordsIds.difference(newRelatedWordsIds))
	// Delete remove relationships
	await db.relatedWords
		.where("wordId")
		.anyOf(relationshipsToDeleteIds)
		.or("relatedId")
		.anyOf(relationshipsToDeleteIds)
		.delete()
	// Create new relationships
	await db.relatedWords.bulkAdd(
		relationshipsToCreateIds.flatMap((id) => {
			return [
				{ wordId: word.id, relatedId: id },
				{ wordId: id, relatedId: word.id },
			]
		}),
	)
}

export async function updateKanjiRelationshipsForWord(word: Word): Promise<void> {
	const oldRelatedKanjisIds = new Set(await getRelatedKanjiIdsForWord(word.id))
	const newRelatedKanjisIds = new Set(word.relatedKanjis)
	const relationshipsToCreateIds = Array.from(newRelatedKanjisIds.difference(oldRelatedKanjisIds))
	const relationshipsToDeleteIds = Array.from(oldRelatedKanjisIds.difference(newRelatedKanjisIds))
	// Delete removed relationships
	await db.relatedWordsKanjis.where("wordId").anyOf(relationshipsToDeleteIds).delete()
	// Create added relationships
	await db.relatedWordsKanjis.bulkAdd(
		relationshipsToCreateIds.map((kanjiId) => ({ wordId: word.id, kanjiId })),
	)
}

export async function updateWordRelationshipsForKanji(kanji: Kanji): Promise<void> {
	const oldRelatedWordsIds = new Set(await getRelatedWordIdsForKanji(kanji.id))
	const newRelatedWordsIds = new Set(kanji.relatedWords)
	const relationshipsToCreateIds = Array.from(newRelatedWordsIds.difference(oldRelatedWordsIds))
	const relationshipsToDeleteIds = Array.from(oldRelatedWordsIds.difference(newRelatedWordsIds))
	// Delete remove relationships
	await db.relatedWordsKanjis.where("wordId").anyOf(relationshipsToDeleteIds).delete()
	// Create new relationships
	await db.relatedWordsKanjis.bulkAdd(
		relationshipsToCreateIds.map((wordId) => ({ wordId, kanjiId: kanji.id })),
	)
}

export async function updateKanjiRelationshipsForKanji(kanji: Kanji): Promise<void> {
	const oldRelatedKanjisIds = new Set(await getRelatedKanjiIdsForKanji(kanji.id))
	const newRelatedKanjisIds = new Set(kanji.relatedKanjis)
	const relationshipsToCreateIds = Array.from(newRelatedKanjisIds.difference(oldRelatedKanjisIds))
	const relationshipsToDeleteIds = Array.from(oldRelatedKanjisIds.difference(newRelatedKanjisIds))
	// Delete remove relationships
	await db.relatedKanjis
		.where("kanjiId")
		.anyOf(relationshipsToDeleteIds)
		.or("relatedId")
		.anyOf(relationshipsToDeleteIds)
		.delete()
	// Create new relationships
	await db.relatedKanjis.bulkAdd(
		relationshipsToCreateIds.flatMap((id) => {
			return [
				{ kanjiId: kanji.id, relatedId: id },
				{ kanjiId: id, relatedId: kanji.id },
			]
		}),
	)
}
