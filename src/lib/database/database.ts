import type {
	UUIDv4,
	WordType,
	JLPTLevel,
	Difficulty,
	VerbType,
	VerbTransitivity,
	AdjectiveType,
	ItemType,
	SimpleWordType,
} from "$lib/model"
import Dexie, { type EntityTable } from "dexie"

export interface ItemData {
	id: UUIDv4
	itemType: ItemType
	meanings: MeaningData[]
	jlptLevel?: JLPTLevel | undefined
	difficulty: Difficulty
	lastStudiedAt?: Date | undefined
	tags: string[]
}

export interface WordData {
	id: UUIDv4
	wordType: WordType
	kanji?: string
	kana: string
	examples: ExampleSentenceData[]
}

export interface SimpleWordData {
	id: UUIDv4
	wordSubtypes: SimpleWordType[]
}

export interface VerbData {
	id: UUIDv4
	verbType?: VerbType | undefined
	transitivity?: VerbTransitivity | undefined
}

export interface AdjectiveData {
	id: UUIDv4
	adjectiveType?: AdjectiveType | undefined
}

export interface KanjiData {
	id: UUIDv4
	kanji: string
	onyomi: string[]
	kunyomi: string[]
	nanori: string[]
}

export interface CounterData {
	id: UUIDv4
	counter: string
	variants: CounterVariantsData
	examples: ExampleSentenceData[]
}

export interface MeaningData {
	meaning: string
	note?: string | undefined
}

export interface ExampleSentenceData {
	english: string
	japanese: string
}

export interface CounterVariantsData {
	1?: string | undefined
	2?: string | undefined
	3?: string | undefined
	4?: string | undefined
	5?: string | undefined
	6?: string | undefined
	7?: string | undefined
	8?: string | undefined
	9?: string | undefined
	10?: string | undefined
	11?: string | undefined
}

export interface ItemRelationshipData {
	itemId: UUIDv4
	relatedId: UUIDv4
	relatedType: ItemType
}

export type Database = Dexie & {
	items: EntityTable<ItemData, "id">
	words: EntityTable<WordData, "id">
	simpleWords: EntityTable<SimpleWordData, "id">
	verbs: EntityTable<VerbData, "id">
	adjectives: EntityTable<AdjectiveData, "id">
	kanjis: EntityTable<KanjiData, "id">
	counters: EntityTable<CounterData, "id">
	itemRelationships: EntityTable<ItemRelationshipData>
}

export const db = new Dexie("JapaneseFlashcards") as Database

db.version(1).stores({
	items: "id, itemType, *meanings, jlptLevel, difficulty, lastStudiedAt, *tags",
	words: "id, wordType, kanji, kana",
	simpleWords: "id, *wordSubtypes",
	verbs: "id, verbType, transitivity",
	adjectives: "id, adjectiveType",
	kanjis: "id, kanji, *onyomi, *kunyomi, *nanori",
	counters: "id, counter, variants",
	itemRelationships: "++, itemId, relatedId, relatedType",
})

export const BASE_ITEM_TABLES = ["items", "itemRelationships"] as const
export const BASE_WORD_TABLES = ["words", "simpleWords", "verbs", "adjectives"] as const
export const BASE_KANJI_TABLES = ["kanjis"] as const
export const BASE_COUNTER_TABLES = ["counters"] as const
export const ITEM_TABLES = [
	...BASE_ITEM_TABLES,
	...BASE_WORD_TABLES,
	...BASE_KANJI_TABLES,
	...BASE_COUNTER_TABLES,
] as const
export const WORD_TABLES = [...BASE_ITEM_TABLES, ...BASE_WORD_TABLES] as const
export const KANJI_TABLES = [...BASE_ITEM_TABLES, ...BASE_KANJI_TABLES] as const
export const COUNTER_TABLES = [...BASE_ITEM_TABLES, ...BASE_COUNTER_TABLES] as const
export const ALL_TABLES = [
	...BASE_ITEM_TABLES,
	...BASE_WORD_TABLES,
	...BASE_KANJI_TABLES,
	...BASE_COUNTER_TABLES,
] as const
