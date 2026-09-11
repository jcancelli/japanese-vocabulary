import {
	ALL_TABLES,
	db,
	type AdjectiveData,
	type CounterData,
	type ItemData,
	type ItemRelationshipData,
	type KanjiData,
	type SimpleWordData,
	type VerbData,
	type WordData,
} from "./database"

export interface SerializedDB {
	version: number
	data: {
		items: ItemData[]
		words: WordData[]
		simpleWords: SimpleWordData[]
		verbs: VerbData[]
		adjectives: AdjectiveData[]
		kanjis: KanjiData[]
		counters: CounterData[]
		itemRelationships: ItemRelationshipData[]
	}
}

export async function exportDb(): Promise<SerializedDB> {
	const version = db.verno
	const [items, words, simpleWords, verbs, adjectives, kanjis, counters, itemRelationships] =
		await Promise.all([
			db.items.toArray(),
			db.words.toArray(),
			db.simpleWords.toArray(),
			db.verbs.toArray(),
			db.adjectives.toArray(),
			db.kanjis.toArray(),
			db.counters.toArray(),
			db.itemRelationships.toArray(),
		])
	return {
		version,
		data: {
			items,
			words,
			simpleWords,
			verbs,
			adjectives,
			kanjis,
			counters,
			itemRelationships,
		},
	}
}

export async function importDb({ version, data }: SerializedDB): Promise<void> {
	if (version !== db.verno) {
		throw new Error(
			`Version mismatch. Imported data version: ${version}, database version: ${db.verno}`,
		)
	}
	await db.transaction("rw", ALL_TABLES, async (tx) => {
		await Promise.all([
			tx.items.bulkPut(
				data.items,
				data.items.map((item) => item.id),
			),
			tx.words.bulkPut(
				data.words,
				data.words.map((word) => word.id),
			),
			tx.simpleWords.bulkPut(
				data.simpleWords,
				data.simpleWords.map((simpleWord) => simpleWord.id),
			),
			tx.verbs.bulkPut(
				data.verbs,
				data.verbs.map((verb) => verb.id),
			),
			tx.adjectives.bulkPut(
				data.adjectives,
				data.adjectives.map((adjective) => adjective.id),
			),
			tx.kanjis.bulkPut(
				data.kanjis,
				data.kanjis.map((kanji) => kanji.id),
			),
			tx.counters.bulkPut(
				data.counters,
				data.counters.map((counter) => counter.id),
			),
			tx.itemRelationships.bulkPut(data.itemRelationships), // FIXME: gotta avoid duplicates
		])
	})
}
