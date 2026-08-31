import type {
	UUIDv4,
	WordType,
	JLPTLevel,
	Difficulty,
	ExampleSentence,
	VerbType,
	VerbTransitivity,
	AdjectiveType,
	WordMeaning,
	KanjiMeaning,
} from "$lib/model"
import Dexie, { type EntityTable } from "dexie"

export interface WordData {
	id: UUIDv4
	wordType: WordType
	jlptLevel: JLPTLevel
	difficulty: Difficulty
	kanji?: string
	kana: string
	meanings: WordMeaningData[]
	examples: ExampleSentence[]
	tags: string[]
	lastStudiedAt: Date
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

export interface KanjiData {
	id: UUIDv4
	kanji: string
	onyomi: string[]
	kunyomi: string[]
	nanori: string[]
	meanings: KanjiMeaningData[]
	jlptLevel: JLPTLevel
	difficulty: Difficulty
	lastStudiedAt: Date
	tags: string[]
}

export interface KanjiRelationship {
	kanjiId: UUIDv4
	relatedId: UUIDv4
}

export interface WordKanjiRelationship {
	wordId: UUIDv4
	kanjiId: UUIDv4
}

export type KanjiMeaningData = KanjiMeaning

export type Database = Dexie & {
	words: EntityTable<WordData, "id">
	verbs: EntityTable<VerbData, "id">
	adjectives: EntityTable<AdjectiveData, "id">
	kanjis: EntityTable<KanjiData, "id">
	relatedWords: EntityTable<WordRelationship>
	relatedKanjis: EntityTable<KanjiRelationship>
	relatedWordsKanjis: EntityTable<WordKanjiRelationship>
}

export const db = new Dexie("JapaneseFlashcards") as Database

db.version(1).stores({
	words: "id, wordType, jlptLevel, difficulty, kanji, kana, meanings, examples, *tags, lastStudiedAt",
	verbs: "id, verbType, transitivity",
	adjectives: "id, adjectiveType",
	kanjis: "id, kanji, *onyomi, *kunyomi, *nanori, meanings, jlptLevel, difficulty, lastStudiedAt, *tags",
	relatedWords: "++, wordId, relatedId",
	relatedKanjis: "++, kanjiId, relatedId",
	relatedWordKanjis: "++, wordId, kanjiId",
})
