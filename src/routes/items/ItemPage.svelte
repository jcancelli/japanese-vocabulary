<script lang="ts">
	import { resolve } from "$app/paths"
	import type { Snippet } from "svelte"
	import HomeIcon from "flowbite-svelte-icons/HomeSolid.svelte"
	import ItemListIcon from "flowbite-svelte-icons/AlignCenterOutline.svelte"
	import Tooltip from "flowbite-svelte/Tooltip.svelte"
	import { ItemType, WordType } from "$lib/model"
	import { ITEM_TYPE_COLOR, WORD_TYPE_COLOR } from "$lib/colors"
	import { ITEM_TYPE_PRETTY_STRING, WORD_TYPE_PRETTY_STRING } from "$lib/strings"

	export interface ItemPageProps {
		itemType: ItemType
		wordType?: WordType
		children: Snippet
		buttons?: Snippet
	}

	let { itemType, wordType, children, buttons }: ItemPageProps = $props()

	const itemTypeColor = $derived.by(() => {
		if (itemType === ItemType.WORD) {
			if (wordType === undefined) {
				throw new Error()
			}
			return WORD_TYPE_COLOR[wordType]
		} else {
			return ITEM_TYPE_COLOR[itemType]
		}
	})
	const itemTypeString = $derived.by(() => {
		if (itemType === ItemType.WORD) {
			if (wordType === undefined) {
				throw new Error()
			}
			return WORD_TYPE_PRETTY_STRING[wordType]
		} else {
			return ITEM_TYPE_PRETTY_STRING[itemType]
		}
	})
</script>

<!-- Nav links -->
<div class="fixed top-3 right-0 z-10 flex flex-row items-center justify-center gap-2 p-4">
	<!-- Items -->
	<a href={resolve("/items/view")}>
		<ItemListIcon size="xl" />
	</a>
	<Tooltip>Items list</Tooltip>
	<!-- Home -->
	<a href={resolve("/")}>
		<HomeIcon size="xl" />
	</a>
	<Tooltip>Home</Tooltip>
</div>
<!-- Page -->
<div
	class="grid h-screen w-screen grid-cols-1 grid-rows-[min-content_1fr_min-content] overflow-auto"
>
	<div
		class="w-full text-center"
		style:background-color={itemTypeColor}
	>
		{itemTypeString}
	</div>
	<!-- Main content -->
	<main class="flex flex-col gap-6 overflow-auto p-6">
		{@render children()}
	</main>
	<!-- Buttons -->
	{#if buttons}
		<div class="flex flex-col flex-nowrap gap-2 px-1 py-3">
			{@render buttons()}
		</div>
	{/if}
</div>
