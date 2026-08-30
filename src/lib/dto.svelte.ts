import {
	AdjectiveType,
	JLPTLevel,
	type VerbTransitivity,
	VerbType,
	WordDifficulty,
	WordType,
	type Adjective,
	type Adverb,
	type Noun,
	type PreNounAdjectival,
	type UUIDv4,
	type Verb,
	type Word,
	type WordMeaning,
	type ExampleSentence,
} from "./model"
import { mapWordMeaningDataToDTO, mapExampleSentenceDataToDTO } from "./database"

export abstract class WordDTO implements Word {
	id: UUIDv4
	abstract get wordType(): WordType
	jlptLevel: JLPTLevel
	difficulty: WordDifficulty
	kanji?: string | undefined
	kana: string
	meanings: WordMeaningDTO[]
	examples: ExampleSentenceDTO[]
	tags: string[]
	relatedWords: UUIDv4[]
	lastStudiedAt: Date

	constructor(
		id: UUIDv4,
		jlptLevel: JLPTLevel,
		difficulty: WordDifficulty,
		kanji: string | undefined,
		kana: string,
		meanings: Iterable<WordMeaning>,
		examples: Iterable<ExampleSentence>,
		tags: Iterable<string>,
		relatedWords: Iterable<UUIDv4>,
		lastStudiedAt: Date,
	) {
		this.id = $state(id)
		this.jlptLevel = $state(jlptLevel)
		this.difficulty = $state(difficulty)
		this.kanji = $state(kanji)
		this.kana = $state(kana)
		this.meanings = $state(Array.from(meanings).map(mapWordMeaningDataToDTO))
		this.examples = $state(Array.from(examples).map(mapExampleSentenceDataToDTO))
		this.tags = $state(Array.from(tags))
		this.relatedWords = $state(Array.from(relatedWords))
		this.lastStudiedAt = $state(new Date(lastStudiedAt))
	}

	abstract copy(): WordDTO

	get primaryWriting(): string {
		return this.kanji ?? this.kana
	}

	get primaryMeaning(): string {
		return this.meanings[0].meaning
	}
}

export class NounDTO extends WordDTO implements Noun {
	constructor(
		id: UUIDv4 = crypto.randomUUID(),
		jlptLevel: JLPTLevel = JLPTLevel.N5,
		difficulty: WordDifficulty = WordDifficulty.DONT_KNOW,
		kanji: string | undefined = undefined,
		kana: string = "",
		meanings: Iterable<WordMeaning> = [],
		examples: Iterable<ExampleSentence> = [],
		tags: Iterable<string> = [],
		relatedWords: Iterable<UUIDv4> = [],
		lastStudiedAt: Date = new Date(0),
	) {
		super(
			id,
			jlptLevel,
			difficulty,
			kanji,
			kana,
			meanings,
			examples,
			tags,
			relatedWords,
			lastStudiedAt,
		)
	}

	get wordType(): WordType.NOUN {
		return WordType.NOUN
	}

	copy(): NounDTO {
		return new NounDTO(
			this.id,
			this.jlptLevel,
			this.difficulty,
			this.kanji,
			this.kana,
			this.meanings,
			this.examples,
			this.tags,
			this.relatedWords,
			this.lastStudiedAt,
		)
	}
}

export class VerbDTO extends WordDTO implements Verb {
	verbType: VerbType
	transitivity: VerbTransitivityDTO

	constructor(
		id: UUIDv4 = crypto.randomUUID(),
		jlptLevel: JLPTLevel = JLPTLevel.N5,
		difficulty: WordDifficulty = WordDifficulty.DONT_KNOW,
		kanji: string | undefined = undefined,
		kana: string = "",
		meanings: Iterable<WordMeaning> = [],
		examples: Iterable<ExampleSentence> = [],
		tags: Iterable<string> = [],
		relatedWords: Iterable<UUIDv4> = [],
		lastStudiedAt: Date = new Date(0),
		verbType: VerbType = VerbType.GODAN,
		transitivity: VerbTransitivity = { transitive: false, intransitive: false },
	) {
		super(
			id,
			jlptLevel,
			difficulty,
			kanji,
			kana,
			meanings,
			examples,
			tags,
			relatedWords,
			lastStudiedAt,
		)
		this.verbType = $state(verbType)
		this.transitivity = $state(
			new VerbTransitivityDTO(transitivity.transitive, transitivity.intransitive),
		)
	}

	get wordType(): WordType.VERB {
		return WordType.VERB
	}

	copy(): VerbDTO {
		return new VerbDTO(
			this.id,
			this.jlptLevel,
			this.difficulty,
			this.kanji,
			this.kana,
			this.meanings,
			this.examples,
			this.tags,
			this.relatedWords,
			this.lastStudiedAt,
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

	copy(): VerbTransitivityDTO {
		return new VerbTransitivityDTO(this.transitive, this.intransitive)
	}
}

export class AdverbDTO extends WordDTO implements Adverb {
	constructor(
		id: UUIDv4 = crypto.randomUUID(),
		jlptLevel: JLPTLevel = JLPTLevel.N5,
		difficulty: WordDifficulty = WordDifficulty.DONT_KNOW,
		kanji: string | undefined = undefined,
		kana: string = "",
		meanings: Iterable<WordMeaning> = [],
		examples: Iterable<ExampleSentence> = [],
		tags: Iterable<string> = [],
		relatedWords: Iterable<UUIDv4> = [],
		lastStudiedAt: Date = new Date(0),
	) {
		super(
			id,
			jlptLevel,
			difficulty,
			kanji,
			kana,
			meanings,
			examples,
			tags,
			relatedWords,
			lastStudiedAt,
		)
	}

	get wordType(): WordType.ADVERB {
		return WordType.ADVERB
	}

	copy(): AdverbDTO {
		return new AdverbDTO(
			this.id,
			this.jlptLevel,
			this.difficulty,
			this.kanji,
			this.kana,
			this.meanings,
			this.examples,
			this.tags,
			this.relatedWords,
			this.lastStudiedAt,
		)
	}
}

export class AdjectiveDTO extends WordDTO implements Adjective {
	adjectiveType: AdjectiveType

	constructor(
		id: UUIDv4 = crypto.randomUUID(),
		jlptLevel: JLPTLevel = JLPTLevel.N5,
		difficulty: WordDifficulty = WordDifficulty.DONT_KNOW,
		kanji: string | undefined = undefined,
		kana: string = "",
		meanings: Iterable<WordMeaning> = [],
		examples: Iterable<ExampleSentence> = [],
		tags: Iterable<string> = [],
		relatedWords: Iterable<UUIDv4> = [],
		lastStudiedAt: Date = new Date(0),
		adjectiveType: AdjectiveType = AdjectiveType.I,
	) {
		super(
			id,
			jlptLevel,
			difficulty,
			kanji,
			kana,
			meanings,
			examples,
			tags,
			relatedWords,
			lastStudiedAt,
		)
		this.adjectiveType = $state(adjectiveType)
	}

	get wordType(): WordType.ADJECTIVE {
		return WordType.ADJECTIVE
	}

	copy(): AdjectiveDTO {
		return new AdjectiveDTO(
			this.id,
			this.jlptLevel,
			this.difficulty,
			this.kanji,
			this.kana,
			this.meanings,
			this.examples,
			this.tags,
			this.relatedWords,
			this.lastStudiedAt,
			this.adjectiveType,
		)
	}
}

export class PreNounAdjectivalDTO extends WordDTO implements PreNounAdjectival {
	constructor(
		id: UUIDv4 = crypto.randomUUID(),
		jlptLevel: JLPTLevel = JLPTLevel.N5,
		difficulty: WordDifficulty = WordDifficulty.DONT_KNOW,
		kanji: string | undefined = undefined,
		kana: string = "",
		meanings: Iterable<WordMeaning> = [],
		examples: Iterable<ExampleSentence> = [],
		tags: Iterable<string> = [],
		relatedWords: Iterable<UUIDv4> = [],
		lastStudiedAt: Date = new Date(0),
	) {
		super(
			id,
			jlptLevel,
			difficulty,
			kanji,
			kana,
			meanings,
			examples,
			tags,
			relatedWords,
			lastStudiedAt,
		)
	}

	get wordType(): WordType.PRE_NOUN_ADJECTIVAL {
		return WordType.PRE_NOUN_ADJECTIVAL
	}

	copy(): PreNounAdjectivalDTO {
		return new PreNounAdjectivalDTO(
			this.id,
			this.jlptLevel,
			this.difficulty,
			this.kanji,
			this.kana,
			this.meanings,
			this.examples,
			this.tags,
			this.relatedWords,
			this.lastStudiedAt,
		)
	}
}

export class WordMeaningDTO implements WordMeaning {
	meaning: string
	note?: string | undefined

	constructor(meaning: string = "", note?: string | undefined) {
		this.meaning = $state(meaning)
		this.note = $state(note)
	}

	copy(): WordMeaningDTO {
		return new WordMeaningDTO(this.meaning, this.note)
	}
}

export class ExampleSentenceDTO implements ExampleSentence {
	japanese: string
	english: string

	constructor(japanese: string = "", english: string = "") {
		this.japanese = $state(japanese)
		this.english = $state(english)
	}

	copy(): ExampleSentenceDTO {
		return new ExampleSentenceDTO(this.japanese, this.english)
	}
}
