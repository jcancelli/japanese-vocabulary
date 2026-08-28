import Dexie, { type Collection, type EntityTable, type InsertType, type WhereClause } from "dexie"
import {
	JLPTLevel,
	WordDifficulty,
	type UUIDv4,
	WordType,
	type WordMeaning,
	type VerbType,
	type VerbTransitivity,
	type AdjectiveType,
	type Word,
	type Verb,
	type Adjective,
	stripId,
	type ExampleSentence,
} from "./model"
import {
	AdjectiveDTO,
	AdverbDTO,
	ExampleSentenceDTO,
	NounDTO,
	PreNounAdjectivalDTO,
	VerbDTO,
	WordDTO,
	WordMeaningDTO,
} from "./dto.svelte"
import type { WordStudySessionParams } from "./study_session"

export interface WordData {
	id: UUIDv4
	wordType: WordType
	jlptLevel: JLPTLevel
	difficulty: WordDifficulty
	kanji?: string
	kana: string
	meanings: WordMeaningData[]
	examples: ExampleSentence[]
	tags: string[]
}

export interface VerbData {
	id: UUIDv4
	verbType: VerbType
	transitivity: VerbTransitivity
}

export interface AdjectiveData {
	id: UUIDv4
	adjectiveType: AdjectiveType
}

export type WordMeaningData = WordMeaning

export interface WordRelationship {
	wordId: UUIDv4
	relatedId: UUIDv4
}

export interface WordRelationshipData {
	relatedWords: UUIDv4[]
}

export type Database = Dexie & {
	words: EntityTable<WordData, "id">
	verbs: EntityTable<VerbData, "id">
	adjectives: EntityTable<AdjectiveData, "id">
	relatedWords: EntityTable<WordRelationship>
}

export const db = new Dexie("JapaneseFlashcards") as Database

db.version(1).stores({
	words: "id, wordType, jlptLevel, difficulty, kanji, kana, meanings, examples, *tags",
	verbs: "id, verbType, transitivity",
	adjectives: "id, adjectiveType",
	relatedWords: "++, wordId, relatedId",
})

export function mapWordToWordData(word: Word): WordData {
	return {
		id: word.id,
		wordType: word.wordType,
		jlptLevel: word.jlptLevel,
		difficulty: word.difficulty,
		kanji: word.kanji,
		kana: word.kana,
		meanings: word.meanings.map(({ meaning, note }) => ({ meaning, note })),
		examples: word.examples.map(({ japanese, english }) => ({ japanese, english })),
		tags: Array.from(word.tags),
	}
}

export function mapNounDataToDto(word: WordData & WordRelationshipData): NounDTO {
	return new NounDTO(
		word.id,
		word.jlptLevel,
		word.difficulty,
		word.kanji,
		word.kana,
		word.meanings,
		word.examples,
		word.tags,
		word.relatedWords,
	)
}

export function mapVerbDataToDto(word: WordData & VerbData & WordRelationshipData): VerbDTO {
	return new VerbDTO(
		word.id,
		word.jlptLevel,
		word.difficulty,
		word.kanji,
		word.kana,
		word.meanings,
		word.examples,
		word.tags,
		word.relatedWords,
		word.verbType,
		word.transitivity,
	)
}

export function mapVerbToVerbData(verb: Verb): VerbData {
	return {
		id: verb.id,
		verbType: verb.verbType,
		transitivity: verb.transitivity,
	}
}

export function mapAdverbDataToDto(word: WordData & WordRelationshipData): AdverbDTO {
	return new AdverbDTO(
		word.id,
		word.jlptLevel,
		word.difficulty,
		word.kanji,
		word.kana,
		word.meanings,
		word.examples,
		word.tags,
		word.relatedWords,
	)
}

export function mapAdjectiveDataToDto(
	word: WordData & AdjectiveData & WordRelationshipData,
): AdjectiveDTO {
	return new AdjectiveDTO(
		word.id,
		word.jlptLevel,
		word.difficulty,
		word.kanji,
		word.kana,
		word.meanings,
		word.examples,
		word.tags,
		word.relatedWords,
		word.adjectiveType,
	)
}

export function mapAdjectiveToAdjectiveData(adjective: Adjective): AdjectiveData {
	return {
		id: adjective.id,
		adjectiveType: adjective.adjectiveType,
	}
}

export function mapPreNounAdjectivalDataToDto(
	word: WordData & WordRelationshipData,
): PreNounAdjectivalDTO {
	return new PreNounAdjectivalDTO(
		word.id,
		word.jlptLevel,
		word.difficulty,
		word.kanji,
		word.kana,
		word.meanings,
		word.examples,
		word.tags,
		word.relatedWords,
	)
}

export function mapWordMeaningDataToDTO(wordMeaning: WordMeaning): WordMeaningDTO {
	return new WordMeaningDTO(wordMeaning.meaning, wordMeaning.note)
}

export function mapExampleSentenceDataToDTO(example: ExampleSentence): ExampleSentenceDTO {
	return new ExampleSentenceDTO(example.japanese, example.english)
}

export async function getAllRelatedWords(wordId: UUIDv4): Promise<WordDTO[]> {
	const relationships = await db.relatedWords.where("wordId").equals(wordId).toArray()
	const wordIds = relationships.map((relationship) => relationship.relatedId)
	return Promise.all(wordIds.map(getWord))
}

export async function getAllNouns(): Promise<NounDTO[]> {
	return await db.words
		.where("wordType")
		.equals(WordType.NOUN)
		.toArray()
		.then((words) => {
			return Promise.all(
				words.map(async (word) => {
					const relationships = await db.relatedWords
						.where("wordId")
						.equals(word.id)
						.toArray()
					const relatedWords = relationships.map((relationship) => relationship.relatedId)
					return mapNounDataToDto({ ...word, relatedWords })
				}),
			)
		})
}

export async function getAllVerbs(): Promise<VerbDTO[]> {
	return await db.words
		.where("wordType")
		.equals(WordType.VERB)
		.toArray()
		.then((words) => {
			return Promise.all(
				words.map(async (word) => {
					const [verb, relationships] = await Promise.all([
						db.verbs.get(word.id),
						db.relatedWords.where("wordId").equals(word.id).toArray(),
					])
					if (!verb) {
						throw new Error()
					}
					const relatedWords = relationships.map((relationship) => relationship.relatedId)
					return mapVerbDataToDto({ ...word, ...verb, relatedWords })
				}),
			)
		})
}

export async function getAllAdverbs(): Promise<AdverbDTO[]> {
	return await db.words
		.where("wordType")
		.equals(WordType.ADVERB)
		.toArray()
		.then((words) => {
			return Promise.all(
				words.map(async (word) => {
					const relationships = await db.relatedWords
						.where("wordId")
						.equals(word.id)
						.toArray()
					const relatedWords = relationships.map((relationship) => relationship.relatedId)
					return mapAdverbDataToDto({ ...word, relatedWords })
				}),
			)
		})
}

export async function getAllAdjectives(): Promise<AdjectiveDTO[]> {
	return await db.words
		.where("wordType")
		.equals(WordType.ADJECTIVE)
		.toArray()
		.then((words) => {
			return Promise.all(
				words.map(async (word) => {
					const [adjective, relationships] = await Promise.all([
						db.adjectives.get(word.id),
						db.relatedWords.where("wordId").equals(word.id).toArray(),
					])
					if (!adjective) {
						throw new Error()
					}
					const relatedWords = relationships.map((relationship) => relationship.relatedId)
					return mapAdjectiveDataToDto({ ...word, ...adjective, relatedWords })
				}),
			)
		})
}

export async function getAllPreNounAdjectivals(): Promise<PreNounAdjectivalDTO[]> {
	return await db.words
		.where("wordType")
		.equals(WordType.PRE_NOUN_ADJECTIVAL)
		.toArray()
		.then((words) => {
			return Promise.all(
				words.map(async (word) => {
					const relationships = await db.relatedWords
						.where("wordId")
						.equals(word.id)
						.toArray()
					const relatedWords = relationships.map((relationship) => relationship.relatedId)
					return mapPreNounAdjectivalDataToDto({ ...word, relatedWords })
				}),
			)
		})
}

export async function getAllWords(): Promise<WordDTO[]> {
	const results = await Promise.all([
		getAllNouns(),
		getAllVerbs(),
		getAllAdverbs(),
		getAllAdjectives(),
		getAllPreNounAdjectivals(),
	])
	return results.flat()
}

export async function createWord(word: Word): Promise<void> {
	// Create base word
	await db.words.add(mapWordToWordData(word), word.id)
	// Create word relationships (bidirectional)
	await Promise.all(
		word.relatedWords.map((relatedWordId) =>
			db.relatedWords.bulkAdd([
				{ wordId: word.id, relatedId: relatedWordId },
				{ wordId: relatedWordId, relatedId: word.id },
			]),
		),
	)
	// Create wordType specific data
	switch (word.wordType) {
		case WordType.NOUN:
			break
		case WordType.VERB:
			await db.verbs.add(mapVerbToVerbData(word as Verb), word.id)
			break
		case WordType.ADVERB:
			break
		case WordType.ADJECTIVE:
			await db.adjectives.add(mapAdjectiveToAdjectiveData(word as Adjective), word.id)
			break
		case WordType.PRE_NOUN_ADJECTIVAL:
			break
		default:
			throw new Error()
	}
}

export async function deleteWord(wordId: UUIDv4): Promise<void> {
	const word = await db.words.get(wordId)
	if (!word) {
		throw new Error()
	}
	await Promise.all([
		// Delete base word data
		db.words.delete(wordId),
		// Delete wordType specific data
		() => {
			switch (word.wordType) {
				case WordType.NOUN:
					return
				case WordType.VERB:
					return db.verbs.delete(wordId)
				case WordType.ADVERB:
					return
				case WordType.ADJECTIVE:
					return db.adjectives.delete(wordId)
				case WordType.PRE_NOUN_ADJECTIVAL:
					return
				default:
					throw new Error()
			}
		},
		// Remove deleted word from relatedWords of other words
		db.relatedWords.where("wordId").equals(wordId).or("relatedId").equals(wordId).delete(),
	])
}

export async function getWord(wordId: UUIDv4): Promise<WordDTO> {
	const [word, relationships] = await Promise.all([
		db.words.get(wordId),
		db.relatedWords.where("wordId").equals(wordId).toArray(),
	])
	if (!word) {
		throw new Error()
	}
	const relatedWordsIds = relationships.map((relationship) => relationship.relatedId)
	switch (word.wordType) {
		case WordType.NOUN:
			return mapNounDataToDto({ ...word, relatedWords: relatedWordsIds })
		case WordType.VERB:
			const verb = await db.verbs.get(wordId)
			if (!verb) {
				throw new Error()
			}
			return mapVerbDataToDto({ ...word, ...verb, relatedWords: relatedWordsIds })
		case WordType.ADVERB:
			return mapAdverbDataToDto({ ...word, relatedWords: relatedWordsIds })
		case WordType.ADJECTIVE:
			const adjective = await db.adjectives.get(wordId)
			if (!adjective) {
				throw new Error()
			}
			return mapAdjectiveDataToDto({ ...word, ...adjective, relatedWords: relatedWordsIds })
		case WordType.PRE_NOUN_ADJECTIVAL:
			return mapPreNounAdjectivalDataToDto({ ...word, relatedWords: relatedWordsIds })
		default:
			throw new Error()
	}
}

export async function updateWord(word: Word): Promise<void> {
	// Update base word
	await db.words.update(word.id, stripId(mapWordToWordData(word)))
	// TODO: destroy deleted word relationships
	// TODO: create new word relationships
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
	}
}

export async function getAllTags(): Promise<string[]> {
	const words = await db.words.toArray()
	const tags = new Set(words.flatMap((word) => word.tags))
	return Array.from(tags)
}

export async function getStudySessionWords(params: WordStudySessionParams): Promise<WordDTO[]> {
	const difficulties: WordDifficulty[] = []
	params.difficulty[WordDifficulty.DONT_KNOW] && difficulties.push(WordDifficulty.DONT_KNOW)
	params.difficulty[WordDifficulty.KINDA_DONT_KNOW]
		&& difficulties.push(WordDifficulty.KINDA_DONT_KNOW)
	params.difficulty[WordDifficulty.KINDA_KNOW] && difficulties.push(WordDifficulty.KINDA_KNOW)
	params.difficulty[WordDifficulty.KNOW] && difficulties.push(WordDifficulty.KNOW)
	params.difficulty[WordDifficulty.UNFORGETTABLE]
		&& difficulties.push(WordDifficulty.UNFORGETTABLE)

	let query = db.words.where("difficulty").anyOf(difficulties)

	const jlptLevels: JLPTLevel[] = []
	params.jlptLevel[JLPTLevel.N5] && jlptLevels.push(JLPTLevel.N5)
	params.jlptLevel[JLPTLevel.N3] && jlptLevels.push(JLPTLevel.N4)
	params.jlptLevel[JLPTLevel.N3] && jlptLevels.push(JLPTLevel.N3)
	params.jlptLevel[JLPTLevel.N2] && jlptLevels.push(JLPTLevel.N2)
	params.jlptLevel[JLPTLevel.N1] && jlptLevels.push(JLPTLevel.N1)

	query = query.and((word) => jlptLevels.includes(word.jlptLevel))

	if (params.tags.only.length > 0) {
		query = query.and((word) => {
			return params.tags.only.every((tag) => word.tags.includes(tag))
		})
	}
	if (params.tags.without.length > 0) {
		query = query.and((word) => {
			return word.tags.every((tag) => !params.tags.without.includes(tag))
		})
	}

	const wordIds = await query.primaryKeys()

	return Promise.all(wordIds.map(getWord))
}
