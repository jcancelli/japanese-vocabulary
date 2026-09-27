import { CounterDTO } from "$lib/dto.svelte"
import {
	assertItemIsCounter,
	ItemType,
	stripId,
	type Item,
	type Counter,
	type UUIDv4,
} from "$lib/model"
import { db, COUNTER_TABLES, type CounterData } from "./database"
import {
	_createItemInternal,
	_deleteItemInternal,
	_getItemDataInternal,
	_getItemDataWithRelationshipsInternal,
	_getItemsDataWithRelationshipsByItemTypeInternal,
	_getItemsDataWithRelationshipsInternal,
	_updateItemInternal,
	type ItemDataWithRelationships,
} from "./items"

export async function getCounter(id: UUIDv4): Promise<CounterDTO> {
	return await db.transaction("r", COUNTER_TABLES, async () => {
		const itemData = await _getItemDataWithRelationshipsInternal(id)
		return _joinCounterDataInternal(itemData)
	})
}

export async function getCounters(ids: UUIDv4[]): Promise<CounterDTO[]> {
	return await db.transaction("r", COUNTER_TABLES, async () => {
		const itemsData = await _getItemsDataWithRelationshipsInternal(ids)
		return await Promise.all(itemsData.map(_joinCounterDataInternal))
	})
}

export async function getAllCounters(): Promise<CounterDTO[]> {
	return await db.transaction("r", COUNTER_TABLES, async () => {
		const itemsData = await _getItemsDataWithRelationshipsByItemTypeInternal(ItemType.COUNTER)
		return await Promise.all(itemsData.map(_joinCounterDataInternal))
	})
}

export async function createCounter(counter: Counter): Promise<void> {
	await db.transaction("rw", COUNTER_TABLES, async () => {
		await _createItemInternal(counter)
		await _createCounterInternal(counter)
	})
}

export async function updateCounter(counter: Counter): Promise<void> {
	await db.transaction("rw", COUNTER_TABLES, async () => {
		await _updateItemInternal(counter)
		await _updateCounterInternal(counter)
	})
}

export async function deleteCounter(id: UUIDv4): Promise<void> {
	await db.transaction("rw", COUNTER_TABLES, async () => {
		const item = await _getItemDataInternal(id)
		if (item.itemType !== ItemType.COUNTER) {
			throw new Error(`Cannot delete counter ${id}. Not a counter.`)
		}
		await _deleteItemInternal(id)
		await _deleteCounterInternal(id)
	})
}

export function mapCounterToData(counter: Counter): CounterData {
	return {
		id: counter.id,
		counter: counter.counter,
		variants: new Map(counter.variants),
		examples: counter.examples.map(({ japanese, english }) => ({ japanese, english })),
	}
}

export async function _createCounterInternal(item: Item): Promise<void> {
	await db.transaction("rw", COUNTER_TABLES, async (tx) => {
		assertItemIsCounter(item)
		const counterData = mapCounterToData(item)
		await tx.counters.add(counterData, counterData.id)
	})
}

export async function _updateCounterInternal(item: Item): Promise<void> {
	await db.transaction("rw", COUNTER_TABLES, async (tx) => {
		assertItemIsCounter(item)
		const counterData = mapCounterToData(item)
		await tx.counters.update(counterData.id, stripId(counterData))
	})
}

export async function _deleteCounterInternal(id: UUIDv4): Promise<void> {
	await db.transaction("rw", COUNTER_TABLES, async (tx) => {
		await tx.counters.delete(id)
	})
}

export async function _joinCounterDataInternal(
	item: ItemDataWithRelationships,
): Promise<CounterDTO> {
	return await db.transaction("r", COUNTER_TABLES, async () => {
		const counter = await _getCounterDataInternal(item.id)
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
			item.relatedWords,
			item.relatedCounters,
			item.relatedCounters,
		)
	})
}

async function _getCounterDataInternal(id: UUIDv4): Promise<CounterData> {
	const counterData = await db.counters.get(id)
	if (!counterData) {
		throw new Error(`Counter ${id} does not exist`)
	}
	return counterData
}
