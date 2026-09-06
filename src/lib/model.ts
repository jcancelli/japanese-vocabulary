export interface VocabularyItem {
	id: UUIDv4
	itemType: VocabularyItemType
	readonly primaryWriting: string
	readonly primaryMeaning: Readonly<Meaning>
	meanings: Meaning[]
	jlptLevel?: JLPTLevel | undefined
	difficulty: Difficulty
	lastStudiedAt?: Date | undefined
	tags: string[]
	relatedWords: UUIDv4[]
	relatedKanjis: UUIDv4[]
	relatedCounters: UUIDv4[]
}

export interface Word extends VocabularyItem {
	itemType: VocabularyItemType.WORD
	wordType: WordType
	kanji?: string | undefined
	kana: string
	examples: ExampleSentence[]
}

export interface SimpleWord extends Word {
	wordType: WordType.SIMPLE
	wordSubtypes: SimpleWordType[]
}

export interface Verb extends Word {
	wordType: WordType.VERB
	verbType?: VerbType | undefined
	transitivity?: VerbTransitivity | undefined
}

export interface Adjective extends Word {
	wordType: WordType.ADJECTIVE
	adjectiveType?: AdjectiveType | undefined
}

export interface Kanji extends VocabularyItem {
	itemType: VocabularyItemType.KANJI
	kanji: string
	onyomi: string[]
	kunyomi: string[]
	nanori: string[]
}

export interface Counter extends VocabularyItem {
	itemType: VocabularyItemType.COUNTER
	counter: string
	variants: CounterVariants
	examples: ExampleSentence[]
}

export interface CounterVariants {
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

export type UUIDv4 = `${string}-${string}-${string}-${string}-${string}`

export enum VocabularyItemType {
	WORD = "WORD",
	KANJI = "KANJI",
	COUNTER = "COUNTER",
}

export enum WordType {
	SIMPLE = "SIMPLE",
	VERB = "VERB",
	ADJECTIVE = "ADJECTIVE",
}

export enum SimpleWordType {
	NOUN = "NOUN",
	ADVERB = "ADVERB",
	PRE_NOUN_ADJECTIVAL = "PRE_NOUN_ADJECTIVAL",
}

export enum JLPTLevel {
	N5 = 5,
	N4 = 4,
	N3 = 3,
	N2 = 2,
	N1 = 1,
}

export type Difficulty = 1 | 2 | 3 | 4 | 5

export enum VerbType {
	GODAN = "GODAN",
	ICHIDAN = "ICHIDAN",
	SURU = "SURU",
	KURU = "KURU",
}

export interface VerbTransitivity {
	transitive: boolean
	intransitive: boolean
}

export enum AdjectiveType {
	I = "I",
	NA = "NA",
}

export interface Meaning {
	meaning: string
	note?: string | undefined
}

export interface ExampleSentence {
	japanese: string
	english: string
}

export function stripId<ID, T extends { id: ID }>(object: T): Omit<T, "id"> {
	const copy = { ...object } as any
	delete copy["id"]
	return copy
}

export function isWord(it: any): it is Word {
	return !!it && typeof it === "object" && "wordType" in it && typeof it.wordType === "string"
}

export function isKanji(it: any): it is Kanji {
	return !!it && typeof it === "object" && "nanori" in it && Array.isArray(it.nanori)
}

export function isCounter(it: any): it is Counter {
	return !!it && typeof it === "object" && "counter" in it && typeof it.counter === "string"
}
