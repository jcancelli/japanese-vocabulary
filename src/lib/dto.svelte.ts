import {
	JLPTLevel,
	VocabularyItemType,
	WordType,
	SimpleWordType,
	VerbType,
	AdjectiveType,
	type VerbTransitivity,
	type Difficulty,
	type Word,
	type SimpleWord,
	type Verb,
	type Adjective,
	type Kanji,
	type UUIDv4,
	type Meaning,
	type ExampleSentence,
	type Counter,
	type CounterVariants,
	type VocabularyItem,
} from "./model"

export abstract class VocabularyItemDTO implements VocabularyItem {
	id: UUIDv4
	meanings: MeaningDTO[]
	jlptLevel: JLPTLevel | undefined
	difficulty: Difficulty
	lastStudiedAt: Date | undefined
	tags: string[]

	constructor(
		id: UUIDv4,
		meanings: Iterable<Meaning>,
		jlptLevel: JLPTLevel | undefined,
		difficulty: Difficulty,
		lastStudiedAt: Date | undefined,
		tags: Iterable<string>,
	) {
		this.id = $state(id)
		this.meanings = $state(Array.from(meanings).map(MeaningDTO.fromInterface))
		this.jlptLevel = $state(jlptLevel)
		this.difficulty = $state(difficulty)
		this.lastStudiedAt = $state(
			lastStudiedAt !== undefined ? new Date(lastStudiedAt) : undefined,
		)
		this.tags = $state(Array.from(tags))
	}

	abstract get itemType(): VocabularyItemType
	abstract get primaryWriting(): string

	get primaryMeaning(): Readonly<MeaningDTO> {
		return this.meanings[0]
	}
}

export abstract class WordDTO extends VocabularyItemDTO implements Word {
	kanji: string | undefined
	kana: string
	examples: ExampleSentenceDTO[]
	relatedWords: UUIDv4[]
	relatedKanjis: UUIDv4[]
	relatedCounters: UUIDv4[]

	constructor(
		id: UUIDv4,
		kanji: string | undefined,
		kana: string,
		meanings: Iterable<Meaning>,
		jlptLevel: JLPTLevel | undefined,
		difficulty: Difficulty,
		lastStudiedAt: Date | undefined,
		examples: Iterable<ExampleSentence>,
		tags: Iterable<string>,
		relatedWords: Iterable<UUIDv4>,
		relatedKanjis: Iterable<UUIDv4>,
		relatedCounters: Iterable<UUIDv4>,
	) {
		super(id, meanings, jlptLevel, difficulty, lastStudiedAt, tags)
		this.kanji = $state(kanji)
		this.kana = $state(kana)
		this.examples = $state(Array.from(examples).map(ExampleSentenceDTO.fromInterface))
		this.relatedWords = $state(Array.from(relatedWords))
		this.relatedKanjis = $state(Array.from(relatedKanjis))
		this.relatedCounters = $state(Array.from(relatedCounters))
	}

	get itemType(): VocabularyItemType.WORD {
		return VocabularyItemType.WORD
	}

	get primaryWriting(): string {
		return this.kanji ?? this.kana
	}

	abstract get wordType(): WordType

	abstract copy(): WordDTO
}

export class SimpleWordDTO extends WordDTO implements SimpleWord {
	wordSubtypes: SimpleWordType[]

	constructor(
		id: UUIDv4 = crypto.randomUUID(),
		kanji: string | undefined = undefined,
		kana: string = "",
		meanings: Iterable<Meaning> = [],
		jlptLevel: JLPTLevel | undefined = undefined,
		difficulty: Difficulty = 1,
		lastStudiedAt: Date | undefined = undefined,
		examples: Iterable<ExampleSentence> = [],
		tags: Iterable<string> = [],
		relatedWords: Iterable<UUIDv4> = [],
		relatedKanjis: Iterable<UUIDv4> = [],
		relatedCounters: Iterable<UUIDv4> = [],
		wordSubtypes: Iterable<SimpleWordType> = [],
	) {
		super(
			id,
			kanji,
			kana,
			meanings,
			jlptLevel,
			difficulty,
			lastStudiedAt,
			examples,
			tags,
			relatedWords,
			relatedKanjis,
			relatedCounters,
		)
		this.wordSubtypes = $state(Array.from(wordSubtypes))
	}

	get wordType(): WordType.SIMPLE {
		return WordType.SIMPLE
	}

	copy(): SimpleWordDTO {
		return new SimpleWordDTO(
			this.id,
			this.kanji,
			this.kana,
			this.meanings,
			this.jlptLevel,
			this.difficulty,
			this.lastStudiedAt,
			this.examples,
			this.tags,
			this.relatedWords,
			this.relatedKanjis,
			this.relatedCounters,
			this.wordSubtypes,
		)
	}
}

export class VerbDTO extends WordDTO implements Verb {
	verbType: VerbType | undefined
	transitivity: VerbTransitivityDTO | undefined

	constructor(
		id: UUIDv4 = crypto.randomUUID(),
		kanji: string | undefined = undefined,
		kana: string = "",
		meanings: Iterable<Meaning> = [],
		jlptLevel: JLPTLevel | undefined = undefined,
		difficulty: Difficulty = 1,
		lastStudiedAt: Date | undefined = undefined,
		examples: Iterable<ExampleSentence> = [],
		tags: Iterable<string> = [],
		relatedWords: Iterable<UUIDv4> = [],
		relatedKanjis: Iterable<UUIDv4> = [],
		relatedCounters: Iterable<UUIDv4> = [],
		verbType: VerbType | undefined = undefined,
		transitivity: VerbTransitivity | undefined = undefined,
	) {
		super(
			id,
			kanji,
			kana,
			meanings,
			jlptLevel,
			difficulty,
			lastStudiedAt,
			examples,
			tags,
			relatedWords,
			relatedKanjis,
			relatedCounters,
		)
		this.verbType = $state(verbType)
		this.transitivity = $state(
			transitivity !== undefined ?
				VerbTransitivityDTO.fromInterface(transitivity)
			:	undefined,
		)
	}

	get wordType(): WordType.VERB {
		return WordType.VERB
	}

	copy(): VerbDTO {
		return new VerbDTO(
			this.id,
			this.kanji,
			this.kana,
			this.meanings,
			this.jlptLevel,
			this.difficulty,
			this.lastStudiedAt,
			this.examples,
			this.tags,
			this.relatedWords,
			this.relatedKanjis,
			this.relatedCounters,
			this.verbType,
			this.transitivity,
		)
	}
}

export class VerbTransitivityDTO implements VerbTransitivity {
	transitive: boolean
	intransitive: boolean

	constructor(transitive: boolean = false, intransitive: boolean = false) {
		this.transitive = $state(transitive)
		this.intransitive = $state(intransitive)
	}

	static fromInterface(transitivity: VerbTransitivity): VerbTransitivityDTO {
		return new VerbTransitivityDTO(transitivity.transitive, transitivity.intransitive)
	}

	copy(): VerbTransitivityDTO {
		return new VerbTransitivityDTO(this.transitive, this.intransitive)
	}
}

export class AdjectiveDTO extends WordDTO implements Adjective {
	adjectiveType: AdjectiveType | undefined

	constructor(
		id: UUIDv4 = crypto.randomUUID(),
		kanji: string | undefined = undefined,
		kana: string = "",
		meanings: Iterable<Meaning> = [],
		jlptLevel: JLPTLevel | undefined = undefined,
		difficulty: Difficulty = 1,
		lastStudiedAt: Date | undefined = undefined,
		examples: Iterable<ExampleSentence> = [],
		tags: Iterable<string> = [],
		relatedWords: Iterable<UUIDv4> = [],
		relatedKanjis: Iterable<UUIDv4> = [],
		relatedCounters: Iterable<UUIDv4> = [],
		adjectiveType: AdjectiveType | undefined = undefined,
	) {
		super(
			id,
			kanji,
			kana,
			meanings,
			jlptLevel,
			difficulty,
			lastStudiedAt,
			examples,
			tags,
			relatedWords,
			relatedKanjis,
			relatedCounters,
		)
		this.adjectiveType = $state(adjectiveType)
	}

	get wordType(): WordType.ADJECTIVE {
		return WordType.ADJECTIVE
	}

	copy(): AdjectiveDTO {
		return new AdjectiveDTO(
			this.id,
			this.kanji,
			this.kana,
			this.meanings,
			this.jlptLevel,
			this.difficulty,
			this.lastStudiedAt,
			this.examples,
			this.tags,
			this.relatedWords,
			this.relatedKanjis,
			this.relatedCounters,
			this.adjectiveType,
		)
	}
}

export class KanjiDTO extends VocabularyItemDTO implements Kanji {
	kanji: string
	onyomi: string[]
	kunyomi: string[]
	nanori: string[]
	relatedWords: UUIDv4[]
	relatedKanjis: UUIDv4[]
	relatedCounters: UUIDv4[]

	constructor(
		id: UUIDv4 = crypto.randomUUID(),
		kanji: string = "",
		onyomi: Iterable<string> = [],
		kunyomi: Iterable<string> = [],
		nanori: Iterable<string> = [],
		meanings: Iterable<Meaning> = [],
		jlptLevel: JLPTLevel | undefined = undefined,
		difficulty: Difficulty = 1,
		lastStudiedAt: Date | undefined = undefined,
		tags: Iterable<string> = [],
		relatedWords: Iterable<UUIDv4> = [],
		relatedKanjis: Iterable<UUIDv4> = [],
		relatedCounters: Iterable<UUIDv4> = [],
	) {
		super(id, meanings, jlptLevel, difficulty, lastStudiedAt, tags)
		this.kanji = $state(kanji)
		this.onyomi = $state(Array.from(onyomi))
		this.kunyomi = $state(Array.from(kunyomi))
		this.nanori = $state(Array.from(nanori))
		this.relatedWords = $state(Array.from(relatedWords))
		this.relatedKanjis = $state(Array.from(relatedKanjis))
		this.relatedCounters = $state(Array.from(relatedCounters))
	}

	copy(): KanjiDTO {
		return new KanjiDTO(
			this.id,
			this.kanji,
			this.onyomi,
			this.kunyomi,
			this.nanori,
			this.meanings,
			this.jlptLevel,
			this.difficulty,
			this.lastStudiedAt,
			this.tags,
			this.relatedWords,
			this.relatedKanjis,
			this.relatedCounters,
		)
	}

	get itemType(): VocabularyItemType.KANJI {
		return VocabularyItemType.KANJI
	}

	get primaryWriting(): string {
		return this.kanji
	}

	get primaryMeaning(): Readonly<MeaningDTO> {
		return this.meanings[0]
	}
}

export class CounterDTO extends VocabularyItemDTO implements Counter {
	counter: string
	variants: CounterVariantsDTO
	examples: ExampleSentenceDTO[]
	relatedWords: UUIDv4[]
	relatedKanjis: UUIDv4[]
	relatedCounters: UUIDv4[]

	constructor(
		id: UUIDv4 = crypto.randomUUID(),
		counter: string = "",
		variants: CounterVariants = {},
		meanings: Iterable<Meaning> = [],
		jlptLevel: JLPTLevel | undefined = undefined,
		difficulty: Difficulty = 1,
		lastStudiedAt: Date | undefined = undefined,
		examples: Iterable<ExampleSentence> = [],
		tags: Iterable<string> = [],
		relatedWords: Iterable<UUIDv4> = [],
		relatedKanjis: Iterable<UUIDv4> = [],
		relatedCounters: Iterable<UUIDv4> = [],
	) {
		super(id, meanings, jlptLevel, difficulty, lastStudiedAt, tags)
		this.counter = $state(counter)
		this.variants = $state(CounterVariantsDTO.fromInterface(variants))
		this.examples = $state(Array.from(examples).map(ExampleSentenceDTO.fromInterface))
		this.relatedWords = $state(Array.from(relatedWords))
		this.relatedKanjis = $state(Array.from(relatedKanjis))
		this.relatedCounters = $state(Array.from(relatedCounters))
	}

	get itemType(): VocabularyItemType.COUNTER {
		return VocabularyItemType.COUNTER
	}

	get primaryWriting(): string {
		return this.counter
	}

	get primaryMeaning(): Readonly<MeaningDTO> {
		return this.meanings[0]
	}

	copy(): CounterDTO {
		return new CounterDTO(
			this.id,
			this.counter,
			this.variants,
			this.meanings,
			this.jlptLevel,
			this.difficulty,
			this.lastStudiedAt,
			this.examples,
			this.tags,
			this.relatedWords,
			this.relatedKanjis,
			this.relatedCounters,
		)
	}
}

export class CounterVariantsDTO implements CounterVariants {
	1: string | undefined
	2: string | undefined
	3: string | undefined
	4: string | undefined
	5: string | undefined
	6: string | undefined
	7: string | undefined
	8: string | undefined
	9: string | undefined
	10: string | undefined
	11: string | undefined

	constructor(variants: CounterVariants = {}) {
		this[1] = $state(variants[1])
		this[2] = $state(variants[2])
		this[3] = $state(variants[3])
		this[4] = $state(variants[4])
		this[5] = $state(variants[5])
		this[6] = $state(variants[6])
		this[7] = $state(variants[7])
		this[8] = $state(variants[8])
		this[9] = $state(variants[9])
		this[10] = $state(variants[10])
		this[11] = $state(variants[11])
	}

	static fromInterface(variants: CounterVariants): CounterVariantsDTO {
		return new CounterVariantsDTO(variants)
	}

	copy(): CounterVariantsDTO {
		return new CounterVariantsDTO(this)
	}
}

export class MeaningDTO implements Meaning {
	meaning: string
	note: string | undefined

	constructor(meaning: string = "", note?: string | undefined) {
		this.meaning = $state(meaning)
		this.note = $state(note)
	}

	static fromInterface(meaning: Meaning): MeaningDTO {
		return new MeaningDTO(meaning.meaning, meaning.note)
	}

	copy(): MeaningDTO {
		return new MeaningDTO(this.meaning, this.note)
	}
}

export class ExampleSentenceDTO implements ExampleSentence {
	japanese: string
	english: string

	constructor(japanese: string = "", english: string = "") {
		this.japanese = $state(japanese)
		this.english = $state(english)
	}

	static fromInterface(sentence: ExampleSentence): ExampleSentenceDTO {
		return new ExampleSentenceDTO(sentence.japanese, sentence.english)
	}

	copy(): ExampleSentenceDTO {
		return new ExampleSentenceDTO(this.japanese, this.english)
	}
}
