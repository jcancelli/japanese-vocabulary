import { AdjectiveDTO, SimpleWordDTO, VerbDTO, WordDTO } from "$lib/dto.svelte"
import {
	assertItemIsWord,
	ItemType,
	stripId,
	WordType,
	type Adjective,
	type Item,
	type SimpleWord,
	type UUIDv4,
	type Verb,
	type Word,
} from "$lib/model"
import {
	db,
	WORD_TABLES,
	type AdjectiveData,
	type SimpleWordData,
	type VerbData,
	type WordData,
} from "./database"
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

export async function getWord(id: UUIDv4): Promise<WordDTO> {
	return await db.transaction("r", WORD_TABLES, async () => {
		const itemData = await _getItemDataWithRelationshipsInternal(id)
		return _joinWordDataInternal(itemData)
	})
}

export async function getWords(ids: UUIDv4[]): Promise<WordDTO[]> {
	return await db.transaction("r", WORD_TABLES, async () => {
		const itemsData = await _getItemsDataWithRelationshipsInternal(ids)
		return await Promise.all(itemsData.map(_joinWordDataInternal))
	})
}

export async function getAllWords(): Promise<WordDTO[]> {
	return await db.transaction("r", WORD_TABLES, async () => {
		const itemsData = await _getItemsDataWithRelationshipsByItemTypeInternal(ItemType.WORD)
		return await Promise.all(itemsData.map(_joinWordDataInternal))
	})
}

export async function createWord(word: Word): Promise<void> {
	await db.transaction("rw", WORD_TABLES, async () => {
		await _createItemInternal(word)
		await _createWordInternal(word)
	})
}

export async function updateWord(word: Word): Promise<void> {
	await db.transaction("rw", WORD_TABLES, async () => {
		await _updateItemInternal(word)
		await _updateWordInternal(word)
	})
}

export async function deleteWord(id: UUIDv4): Promise<void> {
	await db.transaction("rw", WORD_TABLES, async (tx) => {
		const item = await _getItemDataInternal(id)
		if (item.itemType !== ItemType.WORD) {
			throw new Error(`Cannot delete word ${id}. Not a word.`)
		}
		await _deleteItemInternal(id)
		await _deleteWordInternal(id)
	})
}

export function mapWordToData(word: Word): {
	wordData: WordData
	simpleWordData: SimpleWordData | undefined
	verbData: VerbData | undefined
	adjectiveData: AdjectiveData | undefined
} {
	const wordData: WordData = {
		id: word.id,
		wordType: word.wordType,
		kanji: word.kanji,
		kana: word.kana,
		examples: word.examples.map(({ english, japanese }) => ({ english, japanese })),
	}

	let simpleWordData: SimpleWordData | undefined = undefined
	let verbData: VerbData | undefined = undefined
	let adjectiveData: AdjectiveData | undefined = undefined
	switch (word.wordType) {
		case WordType.SIMPLE:
			const simpleWord = word as SimpleWord
			simpleWordData = {
				id: simpleWord.id,
				wordSubtypes: Array.from(simpleWord.wordSubtypes),
			}
			break

		case WordType.VERB:
			const verb = word as Verb
			verbData = {
				id: verb.id,
				verbType: verb.verbType,
				transitivity:
					verb.transitivity ?
						{
							transitive: verb.transitivity.transitive,
							intransitive: verb.transitivity.intransitive,
						}
					:	undefined,
			}
			break

		case WordType.ADJECTIVE:
			const adjective = word as Adjective
			adjectiveData = {
				id: adjective.id,
				adjectiveType: adjective.adjectiveType,
			}
			break

		default:
			throw new Error(`Unexpected wordType ${word.wordType} while joining word data`)
	}

	return { wordData, simpleWordData, verbData, adjectiveData }
}

export async function _createWordInternal(item: Item): Promise<void> {
	await db.transaction("rw", WORD_TABLES, async (tx) => {
		assertItemIsWord(item)

		const { wordData, simpleWordData, verbData, adjectiveData } = mapWordToData(item)

		await tx.words.add(wordData, wordData.id)

		switch (wordData.wordType) {
			case WordType.SIMPLE:
				if (!simpleWordData) {
					throw new Error(`Creating simple word but no simple word data was provided`)
				}
				await tx.simpleWords.add(simpleWordData, simpleWordData.id)
				break

			case WordType.VERB:
				if (!verbData) {
					throw new Error(`Creating verb but no verb data was provided`)
				}
				await tx.verbs.add(verbData, verbData.id)
				break

			case WordType.ADJECTIVE:
				if (!adjectiveData) {
					throw new Error(`Creating adjective but no adjective data was provided`)
				}
				await tx.adjectives.add(adjectiveData, adjectiveData.id)
				break

			default:
				throw new Error(`Updating word with unknown wordType: ${wordData.wordType}`)
		}
	})
}

export async function _updateWordInternal(item: Item): Promise<void> {
	await db.transaction("rw", WORD_TABLES, async (tx) => {
		assertItemIsWord(item)

		const { wordData, simpleWordData, verbData, adjectiveData } = mapWordToData(item)

		await tx.words.update(wordData.id, stripId(wordData))

		switch (wordData.wordType) {
			case WordType.SIMPLE:
				if (!simpleWordData) {
					throw new Error(`Updating simple word but no simple word data was provided`)
				}
				await tx.simpleWords.update(simpleWordData.id, stripId(simpleWordData))
				break

			case WordType.VERB:
				if (!verbData) {
					throw new Error(`Updating verb but no verb data was provided`)
				}
				await tx.verbs.update(verbData.id, stripId(verbData))
				break

			case WordType.ADJECTIVE:
				if (!adjectiveData) {
					throw new Error(`Updating adjective but no adjective data was provided`)
				}
				await tx.adjectives.update(adjectiveData.id, stripId(adjectiveData))
				break

			default:
				throw new Error(`Updating word with unknown wordType: ${wordData.wordType}`)
		}
	})
}

export async function _deleteWordInternal(id: UUIDv4): Promise<void> {
	await db.transaction("rw", WORD_TABLES, async (tx) => {
		const word = await _getWordDataInternal(id)

		await tx.words.delete(word.id)

		switch (word.wordType) {
			case WordType.SIMPLE:
				await tx.simpleWords.delete(id)
				break

			case WordType.VERB:
				await tx.verbs.delete(id)
				break

			case WordType.ADJECTIVE:
				await tx.adjectives.delete(id)
				break

			default:
				throw new Error(`Deleting word with unknown wordType: ${word.wordType}`)
		}
	})
}

export async function _joinWordDataInternal(item: ItemDataWithRelationships): Promise<WordDTO> {
	return await db.transaction("r", WORD_TABLES, async (tx) => {
		const word = await _getWordDataInternal(item.id)

		switch (word.wordType) {
			case WordType.SIMPLE:
				const simpleWord = await tx.simpleWords.get(item.id)
				if (!simpleWord) {
					throw new Error("Joining simple word but no simple word data was provided")
				}
				return new SimpleWordDTO(
					item.id,
					word.kanji,
					word.kana,
					item.meanings,
					item.jlptLevel,
					item.difficulty,
					item.lastStudiedAt,
					word.examples,
					item.tags,
					item.relatedWords,
					item.relatedKanjis,
					item.relatedCounters,
					simpleWord.wordSubtypes,
				)

			case WordType.VERB:
				const verb = await tx.verbs.get(item.id)
				if (!verb) {
					throw new Error("Joining verb but no verb data was provided")
				}
				return new VerbDTO(
					item.id,
					word.kanji,
					word.kana,
					item.meanings,
					item.jlptLevel,
					item.difficulty,
					item.lastStudiedAt,
					word.examples,
					item.tags,
					item.relatedWords,
					item.relatedKanjis,
					item.relatedCounters,
					verb.verbType,
					verb.transitivity,
				)

			case WordType.ADJECTIVE:
				const adjective = await tx.adjectives.get(item.id)
				if (!adjective) {
					throw new Error("Joining adjective but no adjective data was provided")
				}
				return new AdjectiveDTO(
					item.id,
					word.kanji,
					word.kana,
					item.meanings,
					item.jlptLevel,
					item.difficulty,
					item.lastStudiedAt,
					word.examples,
					item.tags,
					item.relatedWords,
					item.relatedKanjis,
					item.relatedCounters,
					adjective.adjectiveType,
				)

			default:
				throw new Error(`Joining word data of unknown wordType: ${word.wordType}`)
		}
	})
}

async function _getWordDataInternal(id: UUIDv4): Promise<WordData> {
	const wordData = await db.words.get(id)
	if (!wordData) {
		throw new Error(`Word ${id} does not exist`)
	}
	return wordData
}
