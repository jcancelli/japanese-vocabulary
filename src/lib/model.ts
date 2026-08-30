export interface Word {
	id: UUIDv4
	wordType: WordType
	jlptLevel: JLPTLevel
	difficulty: WordDifficulty
	kanji?: string
	kana: string
	meanings: WordMeaning[]
	examples: ExampleSentence[]
	tags: string[]
	relatedWords: UUIDv4[]
	lastStudiedAt: Date
}

export interface Noun extends Word {
	wordType: WordType.NOUN
}

export interface Verb extends Word {
	wordType: WordType.VERB
	verbType: VerbType
	transitivity: VerbTransitivity
}

export interface Adverb extends Word {
	wordType: WordType.ADVERB
}

export interface Adjective extends Word {
	wordType: WordType.ADJECTIVE
	adjectiveType: AdjectiveType
}

export interface PreNounAdjectival extends Word {
	wordType: WordType.PRE_NOUN_ADJECTIVAL
}

export type UUIDv4 = `${string}-${string}-${string}-${string}-${string}`

export enum WordType {
	NOUN = "NOUN",
	VERB = "VERB",
	ADVERB = "ADVERB",
	ADJECTIVE = "ADJECTIVE",
	PRE_NOUN_ADJECTIVAL = "PRE_NOUN_ADJECTIVAL",
}

export enum JLPTLevel {
	N5 = 5,
	N4 = 4,
	N3 = 3,
	N2 = 2,
	N1 = 1,
}

export enum WordDifficulty {
	UNFORGETTABLE = 1,
	KNOW = 2,
	KINDA_KNOW = 3,
	KINDA_DONT_KNOW = 4,
	DONT_KNOW = 5,
}

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

export interface WordMeaning {
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
