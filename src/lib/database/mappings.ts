import {
	AdjectiveDTO,
	CounterDTO,
	KanjiDTO,
	SimpleWordDTO,
	VerbDTO,
	type VocabularyItemDTO,
	type WordDTO,
} from "$lib/dto.svelte"
import {
	VocabularyItemType,
	WordType,
	type Adjective,
	type Counter,
	type Kanji,
	type SimpleWord,
	type UUIDv4,
	type Verb,
	type VocabularyItem,
	type Word,
} from "$lib/model"
import type {
	AdjectiveData,
	CounterData,
	ItemRelationshipData,
	KanjiData,
	SimpleWordData,
	VerbData,
	VocabularyItemData,
	WordData,
} from "./database"

export function mapVocabularyItemToData(
	item: VocabularyItem,
): [
	VocabularyItemData,
	ItemRelationshipData[],
	WordData | undefined,
	SimpleWordData | undefined,
	VerbData | undefined,
	AdjectiveData | undefined,
	KanjiData | undefined,
	CounterData | undefined,
] {
	const itemData: VocabularyItemData = {
		id: item.id,
		itemType: item.itemType,
		meanings: item.meanings.map(({ meaning, note }) => ({ meaning, note })),
		jlptLevel: item.jlptLevel,
		difficulty: item.difficulty,
		lastStudiedAt: item.lastStudiedAt,
		tags: Array.from(item.tags),
	}

	const wordsRelationships: ItemRelationshipData[] = item.relatedWords.flatMap((relatedId) => [
		{ itemId: item.id, relatedId, relatedType: VocabularyItemType.WORD },
		{ itemId: relatedId, relatedId: item.id, relatedType: item.itemType },
	])
	const kanjisRelationships: ItemRelationshipData[] = item.relatedKanjis.flatMap((relatedId) => [
		{ itemId: item.id, relatedId, relatedType: VocabularyItemType.KANJI },
		{ itemId: relatedId, relatedId: item.id, relatedType: item.itemType },
	])
	const countersRelationships: ItemRelationshipData[] = item.relatedCounters.flatMap(
		(relatedId) => [
			{ itemId: item.id, relatedId, relatedType: VocabularyItemType.COUNTER },
			{ itemId: relatedId, relatedId: item.id, relatedType: item.itemType },
		],
	)
	const relationshipsData = wordsRelationships
		.concat(kanjisRelationships)
		.concat(countersRelationships)

	let wordData: WordData | undefined = undefined
	let simpleWordData: SimpleWordData | undefined = undefined
	let verbData: VerbData | undefined = undefined
	let adjectiveData: AdjectiveData | undefined = undefined
	let kanjiData: KanjiData | undefined = undefined
	let counterData: CounterData | undefined = undefined
	switch (item.itemType) {
		case VocabularyItemType.WORD:
			;[wordData, simpleWordData, verbData, adjectiveData] = mapWordToData(item as Word)
			break
		case VocabularyItemType.KANJI:
			kanjiData = mapKanjiToData(item as Kanji)
			break
		case VocabularyItemType.COUNTER:
			counterData = mapCounterToData(item as Counter)
			break
		default:
			throw new Error(
				`Mapping vocabulary item to data, unexpected itemType: ${item.itemType}`,
			)
	}

	return [
		itemData,
		relationshipsData,
		wordData,
		simpleWordData,
		verbData,
		adjectiveData,
		kanjiData,
		counterData,
	]
}

export function mapVocabularyItemDataToDTO(
	item: VocabularyItemData,
	relationships: ItemRelationshipData[],
	word: WordData | undefined,
	simpleWord: SimpleWordData | undefined,
	verb: VerbData | undefined,
	adjective: AdjectiveData | undefined,
	kanji: KanjiData | undefined,
	counter: CounterData | undefined,
): VocabularyItemDTO {
	const relatedWords: UUIDv4[] = []
	const relatedKanjis: UUIDv4[] = []
	const relatedCounters: UUIDv4[] = []
	for (const { relatedType, relatedId } of relationships) {
		switch (relatedType) {
			case VocabularyItemType.WORD:
				relatedWords.push(relatedId)
				break
			case VocabularyItemType.KANJI:
				relatedKanjis.push(relatedId)
				break
			case VocabularyItemType.COUNTER:
				relatedCounters.push(relatedId)
				break
			default:
				throw new Error(
					`Mapping vocabulary item data to VocabularyItemDTO, unexpected relatedType: ${item.itemType}`,
				)
		}
	}

	switch (item.itemType) {
		case VocabularyItemType.WORD:
			if (!word) {
				throw new Error(
					`Mapping vocabulary item data to WordDTO, but no word data was provided`,
				)
			}
			return mapWordDataToDTO(
				item,
				relatedWords,
				relatedKanjis,
				relatedCounters,
				word,
				simpleWord,
				verb,
				adjective,
			)
		case VocabularyItemType.KANJI:
			if (!kanji) {
				throw new Error(
					`Mapping vocabulary item data to KanjiDTO, but no kanji data was provided`,
				)
			}
			return mapKanjiDataToDTO(item, relatedWords, relatedKanjis, relatedCounters, kanji)
		case VocabularyItemType.COUNTER:
			if (!counter) {
				throw new Error(
					`Mapping vocabulary item data to CounterDTO, but no counter data was provided`,
				)
			}
			return mapCounterDataToDTO(item, relatedWords, relatedKanjis, relatedCounters, counter)
		default:
			throw new Error(
				`Mapping vocabulary item data to VocabularyItemDTO, unexpected itemType: ${item.itemType}`,
			)
	}
}

export function mapWordToData(
	word: Word,
): [WordData, SimpleWordData | undefined, VerbData | undefined, AdjectiveData | undefined] {
	const wordData: WordData = {
		id: word.id,
		wordType: word.wordType,
		kanji: word.kanji,
		kana: word.kana,
		examples: word.examples.map(({ japanese, english }) => ({ japanese, english })),
	}

	let simpleWordData: SimpleWordData | undefined = undefined
	let verbData: VerbData | undefined = undefined
	let adjectiveData: AdjectiveData | undefined = undefined
	switch (word.wordType) {
		case WordType.SIMPLE:
			const simpleWord = word as SimpleWord
			simpleWordData = {
				id: word.id,
				wordSubtypes: Array.from(simpleWord.wordSubtypes),
			}
			break
		case WordType.VERB:
			const verb = word as Verb
			verbData = {
				id: word.id,
				verbType: verb.verbType,
				transitivity:
					verb.transitivity ?
						{
							transitive: verb.transitivity.transitive,
							intransitive: verb.transitivity.intransitive,
						}
					:	undefined,
			}
			break
		case WordType.ADJECTIVE:
			const adjective = word as Adjective
			adjectiveData = {
				id: word.id,
				adjectiveType: adjective.adjectiveType,
			}
			break
		default:
			throw new Error(`Mapping word to data, unexpected wordType: ${word.wordType}`)
	}

	return [wordData, simpleWordData, verbData, adjectiveData]
}

export function mapWordDataToDTO(
	item: VocabularyItemData,
	relatedWords: UUIDv4[],
	relatedKanjis: UUIDv4[],
	relatedCounters: UUIDv4[],
	word: WordData,
	simpleWord: SimpleWordData | undefined,
	verb: VerbData | undefined,
	adjective: AdjectiveData | undefined,
): WordDTO {
	switch (word.wordType) {
		case WordType.SIMPLE:
			if (!simpleWord) {
				throw new Error(
					`Mapping word data to SimpleWordDTO, but no simple word data was provided`,
				)
			}
			return new SimpleWordDTO(
				item.id,
				word.kanji,
				word.kana,
				item.meanings,
				item.jlptLevel,
				item.difficulty,
				item.lastStudiedAt,
				word.examples,
				item.tags,
				relatedWords,
				relatedKanjis,
				relatedCounters,
				simpleWord.wordSubtypes,
			)
		case WordType.VERB:
			if (!verb) {
				throw new Error(`Mapping word data to VerbDTO, but no verb data was provided`)
			}
			return new VerbDTO(
				item.id,
				word.kanji,
				word.kana,
				item.meanings,
				item.jlptLevel,
				item.difficulty,
				item.lastStudiedAt,
				word.examples,
				item.tags,
				relatedWords,
				relatedKanjis,
				relatedCounters,
				verb.verbType,
				verb.transitivity,
			)
		case WordType.ADJECTIVE:
			if (!adjective) {
				throw new Error(
					`Mapping word data to AdjectiveDTO, but no adjective data was provided`,
				)
			}
			return new AdjectiveDTO(
				item.id,
				word.kanji,
				word.kana,
				item.meanings,
				item.jlptLevel,
				item.difficulty,
				item.lastStudiedAt,
				word.examples,
				item.tags,
				relatedWords,
				relatedKanjis,
				relatedCounters,
				adjective.adjectiveType,
			)
		default:
			throw new Error(`Mapping word data to WordDTO, unexpected wordType ${word.wordType}`)
	}
}

export function mapKanjiToData(kanji: Kanji): KanjiData {
	return {
		id: kanji.id,
		kanji: kanji.kanji,
		onyomi: Array.from(kanji.onyomi),
		kunyomi: Array.from(kanji.kunyomi),
		nanori: Array.from(kanji.nanori),
	}
}

export function mapKanjiDataToDTO(
	item: VocabularyItemData,
	relatedWords: UUIDv4[],
	relatedKanjis: UUIDv4[],
	relatedCounters: UUIDv4[],
	kanji: KanjiData,
): KanjiDTO {
	return new KanjiDTO(
		item.id,
		kanji.kanji,
		kanji.onyomi,
		kanji.kunyomi,
		kanji.nanori,
		item.meanings,
		item.jlptLevel,
		item.difficulty,
		item.lastStudiedAt,
		item.tags,
		relatedWords,
		relatedKanjis,
		relatedCounters,
	)
}

export function mapCounterToData(counter: Counter): CounterData {
	return {
		id: counter.id,
		counter: counter.counter,
		variants: {
			1: counter.variants[1],
			2: counter.variants[2],
			3: counter.variants[3],
			4: counter.variants[4],
			5: counter.variants[5],
			6: counter.variants[6],
			7: counter.variants[7],
			8: counter.variants[8],
			9: counter.variants[9],
			10: counter.variants[10],
			11: counter.variants[11],
		},
		examples: counter.examples.map(({ english, japanese }) => ({ english, japanese })),
	}
}

export function mapCounterDataToDTO(
	item: VocabularyItemData,
	relatedWords: UUIDv4[],
	relatedKanjis: UUIDv4[],
	relatedCounters: UUIDv4[],
	counter: CounterData,
): CounterDTO {
	return new CounterDTO(
		item.id,
		counter.counter,
		counter.variants,
		item.meanings,
		item.jlptLevel,
		item.difficulty,
		item.lastStudiedAt,
		counter.examples,
		item.tags,
		relatedWords,
		relatedKanjis,
		relatedCounters,
	)
}
