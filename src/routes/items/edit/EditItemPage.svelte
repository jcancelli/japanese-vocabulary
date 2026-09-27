<script
	lang="ts"
	generics="TItem extends ItemDTO"
>
	import { ITEM_TYPE_PRETTY_STRING } from "$lib/strings"
	import Button from "flowbite-svelte/Button.svelte"
	import Modal from "flowbite-svelte/Modal.svelte"
	import UpdateIcon from "flowbite-svelte-icons/FloppyDiskSolid.svelte"
	import DeleteIcon from "flowbite-svelte-icons/TrashBinSolid.svelte"
	import type { Snippet } from "svelte"
	import type { ItemDTO } from "$lib/dto.svelte"
	import { goto } from "$app/navigation"
	import type { ZodObject } from "zod"
	import type { Item } from "$lib/model"
	import { resolve } from "$app/paths"
	import ErrorsFeed from "$lib/components/ErrorsFeed.svelte"
	import { deleteItem, updateItem } from "$lib/database/items"
	import ItemPage from "../ItemPage.svelte"

	export interface EditItemPageProps<TItem extends ItemDTO> {
		item: TItem
		Schema: ZodObject
		children: Snippet<[TItem, Errors<TItem>]>
	}

	export type Errors<TItem extends ItemDTO> = {
		[key in keyof TItem]?: string | undefined
	}

	let { item, Schema, children }: EditItemPageProps<TItem> = $props()

	let errorsFeed: ErrorsFeed
	let errors: Errors<TItem> = $state({})
	let showDeleteModal = $state(false)

	async function onedit() {
		clearErrors()

		const parseResult = Schema.safeParse(item)

		// Handle parse errors
		if (parseResult.error) {
			const { issues } = parseResult.error
			for (const issue of issues) {
				const key = issue.path[0]
				if (key in item) {
					errors[key as keyof typeof errors] = issue.message
				} else {
					errorsFeed.addError("Unexpected error while updating an item")
					console.error(parseResult.error)
				}
			}
			return
		}

		const editedItem = parseResult.data as unknown as Item

		try {
			await updateItem(editedItem)
		} catch (err: any) {
			errorsFeed.addError("Unexpected error while updating an item")
			console.error(err)
			return
		}

		goto(resolve("/items/view/[itemId]", { itemId: item.id }))
	}

	async function ondelete() {
		try {
			await deleteItem(item.id)
		} catch (err: any) {
			errorsFeed.addError("Unexpected error while deleting the item")
			console.error(err)
			return
		}
		goto(resolve("/items/view"))
	}

	function clearErrors() {
		errors = {}
	}
</script>

<svelte:head>
	<title>Edit {ITEM_TYPE_PRETTY_STRING[item.itemType]}</title>
</svelte:head>

<ItemPage {item}>
	{@render children(item, errors)}

	{#snippet buttons()}
		<Button
			color="primary"
			onclick={onedit}
		>
			<UpdateIcon /> Update
		</Button>
		<Button
			color="red"
			onclick={() => (showDeleteModal = true)}
		>
			<DeleteIcon /> Delete
		</Button>
	{/snippet}
</ItemPage>

<Modal
	bind:open={showDeleteModal}
	title="Confirm deletion"
>
	<p>
		Do you really want to delete the {ITEM_TYPE_PRETTY_STRING[item.itemType].toLowerCase()}
		<span class="font-bold">
			{item.primaryWriting} ({item.primaryMeaning.meaning})
		</span>
	</p>

	{#snippet footer()}
		<Button
			color="red"
			onclick={ondelete}
		>
			<DeleteIcon /> Delete
		</Button>
		<Button
			color="gray"
			onclick={() => (showDeleteModal = false)}
		>
			Cancel
		</Button>
	{/snippet}
</Modal>

<ErrorsFeed
	bind:this={errorsFeed}
	autoDismissTimeoutMs={5000}
/>
