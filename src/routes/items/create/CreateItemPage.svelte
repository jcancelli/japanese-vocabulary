<script
	lang="ts"
	generics="TItem extends ItemDTO"
>
	import { ITEM_TYPE_PRETTY_STRING } from "$lib/strings"
	import Button from "flowbite-svelte/Button.svelte"
	import CreateIcon from "flowbite-svelte-icons/PlusOutline.svelte"
	import type { Snippet } from "svelte"
	import type { ItemDTO } from "$lib/dto.svelte"
	import { goto } from "$app/navigation"
	import type { ZodObject } from "zod"
	import type { Item } from "$lib/model"
	import { resolve } from "$app/paths"
	import ErrorsFeed from "$lib/components/ErrorsFeed.svelte"
	import { createItem } from "$lib/database/items"
	import ItemPage from "../ItemPage.svelte"

	export interface CreateItemPageProps<TItem extends ItemDTO> {
		item: TItem
		Schema: ZodObject
		children: Snippet<[TItem, Errors<TItem>]>
	}

	export type Errors<TItem extends ItemDTO> = {
		[key in keyof TItem]?: string | undefined
	}

	let { item, Schema, children }: CreateItemPageProps<TItem> = $props()

	let errorsFeed: ErrorsFeed

	let errors: Errors<TItem> = $state({})

	async function oncreate() {
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
					errorsFeed.addError("Unexpected error while creating an item")
					console.error(parseResult.error)
				}
			}
			return
		}

		const newItem = parseResult.data as unknown as Item

		try {
			await createItem(newItem)
		} catch (err: any) {
			errorsFeed.addError("Unexpected error while creating an item")
			console.error(err)
			return
		}

		goto(resolve("/items/view/[itemId]", { itemId: item.id }))
	}

	function clearErrors() {
		errors = {}
	}
</script>

<svelte:head>
	<title>New {ITEM_TYPE_PRETTY_STRING[item.itemType]}</title>
</svelte:head>

<ItemPage {item}>
	{@render children(item, errors)}

	{#snippet buttons()}
		<Button
			color="primary"
			onclick={oncreate}
		>
			<CreateIcon /> Create
		</Button>
	{/snippet}
</ItemPage>

<ErrorsFeed
	bind:this={errorsFeed}
	autoDismissTimeoutMs={5000}
/>
