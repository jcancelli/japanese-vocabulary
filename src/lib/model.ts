export interface WithId {
	id: UUIDv4
}

export interface WithRelationships {
	relatedWords: UUIDv4[]
	relatedKanjis: UUIDv4[]
	relatedCounters: UUIDv4[]
}

export interface Item extends WithId, WithRelationships {
	itemType: ItemType
	readonly primaryWriting: string
	readonly primaryMeaning: Readonly<Meaning>
	meanings: Meaning[]
	jlptLevel?: JLPTLevel | undefined
	difficulty: Difficulty
	lastStudiedAt?: Date | undefined
	tags: string[]
}

export interface Word extends Item {
	itemType: ItemType.WORD
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

export interface Kanji extends Item {
	itemType: ItemType.KANJI
	kanji: string
	onyomi: string[]
	kunyomi: string[]
	nanori: string[]
}

export interface Counter extends Item {
	itemType: ItemType.COUNTER
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

export enum ItemType {
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

export function isItem(it: any): it is Item {
	return !!it && typeof it === "object" && "itemType" in it && typeof it.itemType === "string"
}

export function isWord(it: any): it is Word {
	return isItem(it) && itemIsWord(it)
}

export function itemIsWord(item: Item): item is Word {
	return item.itemType === ItemType.WORD
}

export function isKanji(it: any): it is Kanji {
	return isItem(it) && itemIsKanji(it)
}

export function itemIsKanji(item: Item): item is Kanji {
	return item.itemType === ItemType.KANJI
}

export function isCounter(it: any): it is Counter {
	return isItem(it) && itemIsCounter(it)
}

export function itemIsCounter(item: Item): item is Counter {
	return item.itemType === ItemType.COUNTER
}

export function assertIsItem(it: any): asserts it is Item {
	if (!isItem(it)) {
		throw new Error("Not an item")
	}
}

export function assertIsWord(it: any): asserts it is Word {
	if (!isWord(it)) {
		throw new Error("Not a word")
	}
}

export function assertItemIsWord(item: Item): asserts item is Word {
	if (!itemIsWord(item)) {
		throw new Error("Not a word")
	}
}

export function assertIsKanji(it: any): asserts it is Kanji {
	if (!isKanji(it)) {
		throw new Error("Not a kanji")
	}
}

export function assertItemIsKanji(item: Item): asserts item is Kanji {
	if (!itemIsKanji(item)) {
		throw new Error("Not a kanji")
	}
}

export function assertIsCounter(it: any): asserts it is Counter {
	if (!isCounter(it)) {
		throw new Error("Not a counter")
	}
}

export function assertItemIsCounter(item: Item): asserts item is Counter {
	if (!itemIsCounter(item)) {
		throw new Error("Not a counter")
	}
}
