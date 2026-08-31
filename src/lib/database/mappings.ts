import {
	AdjectiveDTO,
	AdverbDTO,
	KanjiDTO,
	NounDTO,
	PreNounAdjectivalDTO,
	VerbDTO,
	WordDTO,
} from "$lib/dto.svelte"
import { type Word, type Verb, type Adjective, type Kanji, WordType, type UUIDv4 } from "$lib/model"
import type {
	WordData,
	VerbData,
	AdjectiveData,
	KanjiData,
	WordRelationship,
	WordKanjiRelationship,
	KanjiRelationship,
} from "./database"

export function mapWordToWordData(
	word: Word,
): [
	WordData,
	WordRelationship[],
	WordKanjiRelationship[],
	VerbData | undefined,
	AdjectiveData | undefined,
] {
	const wordData: WordData = {
		id: word.id,
		wordType: word.wordType,
		jlptLevel: word.jlptLevel,
		difficulty: word.difficulty,
		kanji: word.kanji,
		kana: word.kana,
		meanings: word.meanings.map(({ meaning, note }) => ({ meaning, note })),
		examples: word.examples.map(({ japanese, english }) => ({ japanese, english })),
		tags: Array.from(word.tags),
		lastStudiedAt: new Date(word.lastStudiedAt),
	}

	const wordRelationships = word.relatedWords.map((relatedId) => ({ wordId: word.id, relatedId }))

	const wordKanjiRelationships = word.relatedKanjis.map((kanjiId) => ({
		wordId: word.id,
		kanjiId: kanjiId,
	}))

	let verbData: VerbData | undefined = undefined
	let adjectiveData: AdjectiveData | undefined = undefined
	switch (word.wordType) {
		case WordType.NOUN:
		case WordType.ADVERB:
		case WordType.PRE_NOUN_ADJECTIVAL:
			break
		case WordType.VERB:
			verbData = {
				id: word.id,
				verbType: (word as Verb).verbType,
				transitivity: (word as Verb).transitivity,
			}
			break
		case WordType.ADJECTIVE:
			adjectiveData = {
				id: word.id,
				adjectiveType: (word as Adjective).adjectiveType,
			}
			break
		default:
			throw new Error(`Invalid word type: ${word.wordType}`)
	}

	return [wordData, wordRelationships, wordKanjiRelationships, verbData, adjectiveData]
}

export function mapWordDataToWordDTO(
	word: WordData,
	relatedWords: UUIDv4[],
	relatedKanjis: UUIDv4[],
	verbData: VerbData | undefined,
	adjectiveData: AdjectiveData | undefined,
): WordDTO {
	switch (word.wordType) {
		case WordType.NOUN:
			return new NounDTO(
				word.id,
				word.jlptLevel,
				word.difficulty,
				word.kanji,
				word.kana,
				word.meanings,
				word.examples,
				word.tags,
				relatedWords,
				relatedKanjis,
				word.lastStudiedAt,
			)
		case WordType.VERB:
			if (!verbData) {
				throw new Error(`Mapping word data to VerbDTO, but no verb data was provided`)
			}
			return new VerbDTO(
				word.id,
				word.jlptLevel,
				word.difficulty,
				word.kanji,
				word.kana,
				word.meanings,
				word.examples,
				word.tags,
				relatedWords,
				relatedKanjis,
				word.lastStudiedAt,
				verbData.verbType,
				verbData.transitivity,
			)
		case WordType.ADVERB:
			return new AdverbDTO(
				word.id,
				word.jlptLevel,
				word.difficulty,
				word.kanji,
				word.kana,
				word.meanings,
				word.examples,
				word.tags,
				relatedWords,
				relatedKanjis,
				word.lastStudiedAt,
			)
		case WordType.ADJECTIVE:
			if (!adjectiveData) {
				throw new Error(
					`Mapping word data to AdjectiveDTO, but no adjective data was provided`,
				)
			}
			return new AdjectiveDTO(
				word.id,
				word.jlptLevel,
				word.difficulty,
				word.kanji,
				word.kana,
				word.meanings,
				word.examples,
				word.tags,
				relatedWords,
				relatedKanjis,
				word.lastStudiedAt,
				adjectiveData.adjectiveType,
			)
		case WordType.PRE_NOUN_ADJECTIVAL:
			return new PreNounAdjectivalDTO(
				word.id,
				word.jlptLevel,
				word.difficulty,
				word.kanji,
				word.kana,
				word.meanings,
				word.examples,
				word.tags,
				relatedWords,
				relatedKanjis,
				word.lastStudiedAt,
			)
		default:
			throw new Error(`Invalid word type: ${word.wordType}`)
	}
}

export function mapKanjiToKanjiData(
	kanji: Kanji,
): [KanjiData, KanjiRelationship[], WordKanjiRelationship[]] {
	const kanjiData: KanjiData = {
		id: kanji.id,
		kanji: kanji.kanji,
		onyomi: Array.from(kanji.onyomi),
		kunyomi: Array.from(kanji.kunyomi),
		nanori: Array.from(kanji.nanori),
		meanings: kanji.meanings.map(({ meaning, note }) => ({ meaning, note })),
		jlptLevel: kanji.jlptLevel,
		difficulty: kanji.difficulty,
		lastStudiedAt: new Date(kanji.lastStudiedAt),
		tags: Array.from(kanji.tags),
	}
	const kanjiRelationships = kanji.relatedKanjis.flatMap((relatedId) => [
		{ kanjiId: kanji.id, relatedId },
		{ kanjiId: relatedId, relatedId: kanji.id },
	])
	const wordKanjiRelationships = kanji.relatedWords.map((wordId) => ({
		wordId,
		kanjiId: kanji.id,
	}))
	return [kanjiData, kanjiRelationships, wordKanjiRelationships]
}

export function mapKanjiDataToKanjiDTO(
	kanji: KanjiData,
	relatedKanjis: UUIDv4[],
	relatedWords: UUIDv4[],
): KanjiDTO {
	return new KanjiDTO(
		kanji.id,
		kanji.kanji,
		kanji.onyomi,
		kanji.kunyomi,
		kanji.nanori,
		kanji.meanings,
		kanji.jlptLevel,
		kanji.difficulty,
		kanji.lastStudiedAt,
		kanji.tags,
		relatedWords,
		relatedKanjis,
	)
}
