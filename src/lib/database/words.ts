// TODO: move db operations into transactions

import type { WordDTO } from "$lib/dto.svelte"
import { WordType, type UUIDv4, type Word } from "$lib/model"
import { db, type AdjectiveData, type VerbData, type WordData } from "./database"
import { mapWordDataToWordDTO, mapWordToWordData } from "./mappings"
import { getRelatedKanjiIdsForWord, getRelatedWordIdsForWord } from "./relationships"

export async function getWord(wordId: UUIDv4): Promise<WordDTO> {
	return await db.words.get(wordId).then(async (word) => {
		if (!word) {
			throw new Error(`Word ${wordId} does not exist`)
		}
		return await joinWordData(word)
	})
}

export async function getWords(wordIds: UUIDv4[]): Promise<WordDTO[]> {
	return await db.words.bulkGet(wordIds).then(async (words) => {
		if (words.includes(undefined)) {
			const missingWordsIds = words
				.map((_, index) => (!words ? wordIds[index] : null))
				.filter((it) => it !== null)
			throw new Error(`Unable to find word(s) with id(s): ${missingWordsIds.join(", ")}`)
		}
		return await Promise.all((words as WordData[]).map(joinWordData))
	})
}

export async function getAllWords(): Promise<WordDTO[]> {
	return await db.words
		.toArray()
		.then(async (words) => await Promise.all(words.map(joinWordData)))
}

async function joinWordData(word: WordData): Promise<WordDTO> {
	const [relatedWords, relatedKanjis] = await Promise.all([
		getRelatedWordIdsForWord(word.id),
		getRelatedKanjiIdsForWord(word.id),
	])

	let verbData: VerbData | undefined = undefined
	let adjectiveData: AdjectiveData | undefined = undefined
	switch (word.wordType) {
		case WordType.NOUN:
		case WordType.ADVERB:
		case WordType.PRE_NOUN_ADJECTIVAL:
			// NO-OP
			break
		case WordType.VERB:
			verbData = await db.verbs.get(word.id)
			break
		case WordType.ADJECTIVE:
			adjectiveData = await db.adjectives.get(word.id)
			break
		default:
			throw new Error(`Invalid word type: ${word.wordType}`)
	}

	return mapWordDataToWordDTO(word, relatedWords, relatedKanjis, verbData, adjectiveData)
}

export async function createWord(word: Word): Promise<void> {
	const [wordData, wordRelationships, kanjiRelationships, verbData, adjectiveData] =
		mapWordToWordData(word)

	await Promise.all([
		db.words.add(wordData, wordData.id),
		db.relatedWords.bulkAdd(wordRelationships),
		db.relatedWordsKanjis.bulkAdd(kanjiRelationships),
	])

	// Create wordType specific data
	switch (word.wordType) {
		case WordType.NOUN:
		case WordType.ADVERB:
		case WordType.PRE_NOUN_ADJECTIVAL:
			break
		case WordType.VERB:
			if (!verbData) {
				throw new Error(`Creating new verb, but no verb data was provided`)
			}
			await db.verbs.add(verbData, verbData.id)
			break
		case WordType.ADJECTIVE:
			if (!adjectiveData) {
				throw new Error(`Creating new adjective, but no adjective data was provided`)
			}
			await db.adjectives.add(adjectiveData, adjectiveData.id)
			break
		default:
			throw new Error(`Invalid word type: ${word.wordType}`)
	}
}

export async function deleteWord(wordId: UUIDv4): Promise<void> {
	const word = await db.words.get(wordId)
	if (!word) {
		throw new Error(`Cannot find word to delete with id ${wordId}`)
	}

	await Promise.all([
		// Delete base word data
		db.words.delete(wordId),
		// Delete wordType specific data
		async () => {
			switch (word.wordType) {
				case WordType.NOUN:
				case WordType.ADVERB:
				case WordType.PRE_NOUN_ADJECTIVAL:
					return
				case WordType.VERB:
					return await db.verbs.delete(wordId)
				case WordType.ADJECTIVE:
					return await db.adjectives.delete(wordId)
				default:
					throw new Error(`Invalid word type: ${word.wordType}`)
			}
		},
		// Delete word relationships
		db.relatedWords.where("wordId").equals(wordId).or("relatedId").equals(wordId).delete(),
		// Delete kanji relationships
		db.relatedWordsKanjis.where("wordId").equals(wordId).delete(),
	])
}

// TODO: re-implement updateWord
export async function updateWord(word: Word): Promise<void> {
	throw new Error("TODO")
	/*// Update base word
	await db.words.update(word.id, stripId(mapWordToWordData(word)))

	// Update word relationships
	const oldRelatedWordsIds = await db.relatedWords
		.where("wordId")
		.equals(word.id)
		.toArray()
		.then((relationships) => {
			return new Set(relationships.map((relationship) => relationship.relatedId))
		})
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

	// Update wordType specific data
	switch (word.wordType) {
		case WordType.NOUN:
			break
		case WordType.VERB:
			await db.verbs.update(word.id, stripId(mapVerbToVerbData(word as Verb)))
			break
		case WordType.ADVERB:
			break
		case WordType.ADJECTIVE:
			await db.adjectives.update(
				word.id,
				stripId(mapAdjectiveToAdjectiveData(word as Adjective)),
			)
			break
		case WordType.PRE_NOUN_ADJECTIVAL:
			break
		default:
			throw new Error()
	}*/
}

export async function getAllWordTags(): Promise<string[]> {
	const words = await db.words.toArray()
	const tags = new Set(words.flatMap((word) => word.tags))
	return Array.from(tags)
}
