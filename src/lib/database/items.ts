import type { ItemDTO } from "$lib/dto.svelte"
import { stripId, ItemType, type UUIDv4, type Item, type WithRelationships } from "$lib/model"
import { db, BASE_ITEM_TABLES, ITEM_TABLES, type ItemData } from "./database"
import {
	_createWordInternal,
	_deleteWordInternal,
	_updateWordInternal,
	_joinWordDataInternal,
} from "./words"
import {
	_createKanjiInternal,
	_deleteKanjiInternal,
	_updateKanjiInternal,
	_joinKanjiDataInternal,
} from "./kanjis"
import {
	_createCounterInternal,
	_deleteCounterInternal,
	_updateCounterInternal,
	_joinCounterDataInternal,
} from "./counters"
import {
	getRelatedItemsIdsItem,
	mapItemToItemRelationships,
	updateItemRelationships,
} from "./relationships"

export async function getItem(itemId: UUIDv4): Promise<ItemDTO> {
	return await db.transaction("r", ITEM_TABLES, async () => {
		const itemDataWithRelationships = await _getItemDataWithRelationshipsInternal(itemId)
		return _joinItemData(itemDataWithRelationships)
	})
}

export async function getItems(itemIds: UUIDv4[]): Promise<ItemDTO[]> {
	return await db.transaction("r", ITEM_TABLES, async () => {
		const itemsDataWithRelationships = await _getItemsDataWithRelationshipsInternal(itemIds)
		return await Promise.all(itemsDataWithRelationships.map(_joinItemData))
	})
}

export async function getAllItems(): Promise<ItemDTO[]> {
	return await db.transaction("r", ITEM_TABLES, async () => {
		const itemsDataWithRelationships = await _getAllItemsDataWithRelationshipsInternal()
		return await Promise.all(itemsDataWithRelationships.map(_joinItemData))
	})
}

export async function createItem(item: Item): Promise<void> {
	await db.transaction("rw", ITEM_TABLES, async () => {
		await _createItemInternal(item)

		switch (item.itemType) {
			case ItemType.WORD:
				await _createWordInternal(item)
				break

			case ItemType.KANJI:
				await _createKanjiInternal(item)
				break

			case ItemType.COUNTER:
				await _createCounterInternal(item)
				break

			default:
				throw new Error(`Creating vocabulary item with unknown itemType: ${item.itemType}`)
		}
	})
}

export async function updateItem(item: Item): Promise<void> {
	await db.transaction("rw", ITEM_TABLES, async () => {
		await _updateItemInternal(item)

		switch (item.itemType) {
			case ItemType.WORD:
				await _updateWordInternal(item)
				break

			case ItemType.KANJI:
				await _updateKanjiInternal(item)
				break

			case ItemType.COUNTER:
				await _updateCounterInternal(item)
				break

			default:
				throw new Error(`Updating vocabulary item with unknown itemType: ${item.itemType}`)
		}
	})
}

export async function deleteItem(itemId: UUIDv4): Promise<void> {
	await db.transaction("rw", ITEM_TABLES, async (tx) => {
		const item = await tx.items.get(itemId)
		if (!item) {
			throw new Error(`Cannot find item to delete, id ${itemId}`)
		}

		await _deleteItemInternal(itemId)

		switch (item.itemType) {
			case ItemType.WORD:
				await _deleteWordInternal(itemId)
				break

			case ItemType.KANJI:
				await _deleteKanjiInternal(itemId)
				break

			case ItemType.COUNTER:
				await _deleteCounterInternal(itemId)
				break

			default:
				throw new Error(`Deleting vocabulary item with unknown itemType: ${item.itemType}`)
		}
	})
}

export async function getAllItemsTags(): Promise<string[]> {
	const items = await db.items.toArray()
	const tags = new Set(items.flatMap((item) => item.tags))
	return Array.from(tags)
}

export function mapItemToData(item: Item): ItemData {
	return {
		id: item.id,
		itemType: item.itemType,
		meanings: item.meanings.map(({ meaning, note }) => ({ meaning, note })),
		jlptLevel: item.jlptLevel,
		difficulty: item.difficulty,
		lastStudiedAt: item.lastStudiedAt,
		tags: Array.from(item.tags),
	}
}

/** Only create the base item and its relationships */
export async function _createItemInternal(item: Item): Promise<void> {
	await db.transaction("rw", BASE_ITEM_TABLES, async (tx) => {
		const itemData = mapItemToData(item)
		const relationshipsData = mapItemToItemRelationships(item)
		await tx.items.add(itemData, itemData.id)
		await tx.itemRelationships.bulkAdd(relationshipsData)
	})
}

/** Only update the base item and its relationships */
export async function _updateItemInternal(item: Item): Promise<void> {
	await db.transaction("rw", BASE_ITEM_TABLES, async (tx) => {
		const itemData = mapItemToData(item)
		await tx.items.update(itemData.id, stripId(itemData))
		await updateItemRelationships(item)
	})
}

/** Only delete the base item and its relationhips */
export async function _deleteItemInternal(itemId: UUIDv4): Promise<void> {
	await db.transaction("rw", BASE_ITEM_TABLES, async (tx) => {
		await tx.items.delete(itemId)
		await tx.itemRelationships
			.where("itemId")
			.equals(itemId)
			.or("relatedId")
			.equals(itemId)
			.delete()
	})
}

export type ItemDataWithRelationships = ItemData & WithRelationships

export async function _getItemDataWithRelationshipsInternal(
	itemId: UUIDv4,
): Promise<ItemDataWithRelationships> {
	return await db.transaction("r", BASE_ITEM_TABLES, async (tx) => {
		const itemData = await tx.items.get(itemId)
		if (!itemData) {
			throw new Error(`Vocabulary item ${itemId} does not exist`)
		}
		const relationships = await getRelatedItemsIdsItem(itemId)
		return { ...itemData, ...relationships }
	})
}

export async function _getItemsDataWithRelationshipsInternal(
	itemIds: UUIDv4[],
): Promise<ItemDataWithRelationships[]> {
	return await db.transaction("r", BASE_ITEM_TABLES, async (tx) => {
		const items = await tx.items.bulkGet(itemIds)
		if (items.includes(undefined)) {
			const missingIds = items
				.map((item, index) => (!item ? itemIds[index] : null))
				.filter((it) => it !== null)
			throw new Error(
				`Unable to find vocabulary item(s) with id(s): ${missingIds.join(", ")}`,
			)
		}
		return Promise.all(
			(items as ItemData[]).map(async (itemData) => {
				const relationships = await getRelatedItemsIdsItem(itemData.id)
				return { ...itemData, ...relationships }
			}),
		)
	})
}

export async function _getItemsDataWithRelationshipsByItemTypeInternal(
	itemType: ItemType,
): Promise<ItemDataWithRelationships[]> {
	return await db.transaction("r", BASE_ITEM_TABLES, async (tx) => {
		const itemsData = await tx.items.where("itemType").equals(itemType).toArray()
		return Promise.all(
			itemsData.map(async (itemData) => {
				const relationships = await getRelatedItemsIdsItem(itemData.id)
				return { ...itemData, ...relationships }
			}),
		)
	})
}

export async function _getAllItemsDataWithRelationshipsInternal(): Promise<
	ItemDataWithRelationships[]
> {
	return await db.transaction("r", BASE_ITEM_TABLES, async (tx) => {
		const itemsData = await tx.items.toArray()
		return Promise.all(
			itemsData.map(async (itemData) => {
				const relationships = await getRelatedItemsIdsItem(itemData.id)
				return { ...itemData, ...relationships }
			}),
		)
	})
}

async function _joinItemData(item: ItemDataWithRelationships): Promise<ItemDTO> {
	return await db.transaction("r", ITEM_TABLES, async () => {
		switch (item.itemType) {
			case ItemType.WORD:
				return await _joinWordDataInternal(item)

			case ItemType.KANJI:
				return await _joinKanjiDataInternal(item)

			case ItemType.COUNTER:
				return await _joinCounterDataInternal(item)

			default:
				throw new Error(`Joining item data of unknown itemType: ${item.itemType}`)
		}
	})
}
