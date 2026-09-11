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
			tx.items.bulkPut(data.items),
			tx.words.bulkPut(data.words),
			tx.simpleWords.bulkPut(data.simpleWords),
			tx.verbs.bulkPut(data.verbs),
			tx.adjectives.bulkPut(data.adjectives),
			tx.kanjis.bulkPut(data.kanjis),
			tx.counters.bulkPut(data.counters),
			tx.itemRelationships.bulkPut(data.itemRelationships), // FIXME: gotta avoid duplicates
		])
	})
}
