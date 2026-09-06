export interface Word {
	id: UUIDv4
	wordType: WordType
	jlptLevel?: JLPTLevel
	difficulty: Difficulty
	kanji?: string
	kana: string
	meanings: Meaning[]
	examples: ExampleSentence[]
	tags: string[]
	relatedWords: UUIDv4[]
	relatedKanjis: UUIDv4[]
	relatedCounters: UUIDv4[]
	lastStudiedAt?: Date
}

export interface SimpleWord extends Word {
	wordType: WordType.SIMPLE
	wordSubtypes: SimpleWordType[]
}

export interface Verb extends Word {
	wordType: WordType.VERB
	verbType?: VerbType
	transitivity?: VerbTransitivity
}

export interface Adjective extends Word {
	wordType: WordType.ADJECTIVE
	adjectiveType?: AdjectiveType
}

export interface Kanji {
	id: UUIDv4
	kanji: string
	onyomi: string[]
	kunyomi: string[]
	nanori: string[]
	meanings: Meaning[]
	jlptLevel?: JLPTLevel
	difficulty: Difficulty
	lastStudiedAt?: Date
	tags: string[]
	relatedWords: UUIDv4[]
	relatedKanjis: UUIDv4[]
	relatedCounter: UUIDv4[]
}

export interface Counter {
	id: UUIDv4
	writing: string
	pronounciations: CounterVariants
	meanings: Meaning[]
	jlptLevel?: JLPTLevel
	difficulty: Difficulty
	lastStudiedAt?: Date
	tags: string[]
	relatedWords: UUIDv4[]
	relatedKanjis: UUIDv4[]
	relatedCounters: UUIDv4[]
}

export interface CounterVariants {
	1: string
	2: string
	3: string
	4: string
	5: string
	6: string
	7: string
	8: string
	9: string
	10: string
	11: string
}

export type UUIDv4 = `${string}-${string}-${string}-${string}-${string}`

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
	note?: string
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
