<script lang="ts">
	import type { ItemType, UUIDv4 } from "$lib/model"
	import Fuse from "fuse.js"
	import Search from "flowbite-svelte/Search.svelte"
	import Listgroup from "flowbite-svelte/Listgroup.svelte"
	import CloseButton from "flowbite-svelte/CloseButton.svelte"
	import { getAllItemsOfType, getItems } from "$lib/database/items"

	export interface RelatedItemsInputProps {
		value: UUIDv4[]
		itemId: UUIDv4
		relatedType: ItemType
		disabled?: boolean
		class?: string
	}

	let {
		value = $bindable(),
		itemId,
		relatedType,
		disabled,
		...props
	}: RelatedItemsInputProps = $props()

	let searchTerm = $state("")

	const fusePromise = $derived(
		getAllItemsOfType(relatedType).then(
			(items) =>
				new Fuse(items, {
					keys: ["searchStrings"],
				}),
		),
	)
	const suggestionsPromise = $derived.by(async () => {
		const fuse = await fusePromise
		const excludeIds = new Set(value)
		return (
			fuse
				.search(searchTerm)
				// Exclude already related words
				.filter((match) => !excludeIds.has(match.item.id))
				// Max 5 suggestions
				.slice(0, 5)
		)
	})

	const relatedItemsPromise = $derived(getItems(value))

	function addRelatedItem(relatedItemId: UUIDv4) {
		if (value.includes(relatedItemId)) {
			throw new Error()
		}
		value.push(relatedItemId)
		searchTerm = ""
	}
</script>

<div {...props}>
	<!-- Search input -->
	<div>
		<Search
			bind:value={searchTerm}
			placeholder="Search"
			clearable
			clearableOnClick={() => (searchTerm = "")}
			{disabled}
		/>
		{#if searchTerm !== ""}
			{#await suggestionsPromise then suggestions}
				<Listgroup
					active
					items={suggestions.map((suggestion) => {
						const { id, primaryWriting, primaryMeaning } = suggestion.item
						return { name: `${primaryWriting} (${primaryMeaning.meaning})`, itemid: id }
					})}
					onclick={(e) => {
						if (disabled) {
							return
						}
						const suggestedItemId = (
							e!.currentTarget as HTMLButtonElement
						).attributes.getNamedItem("itemid")?.nodeValue
						addRelatedItem(suggestedItemId as UUIDv4)
					}}
				/>
			{/await}
		{/if}
	</div>
	<!-- Entries -->
	<div class="grid grid-cols-[1fr_2.4rem] items-center p-4">
		{#await relatedItemsPromise then relatedItems}
			{#each relatedItems as relatedItem, i (relatedItem.id)}
				{@const { primaryWriting, primaryMeaning } = relatedItem}
				<p class="text-sm">{primaryWriting} ({primaryMeaning.meaning})</p>
				<CloseButton
					onclick={() => value.splice(i, 1)}
					class="w-fit"
				/>
			{:else}
				<p class="col-span-2 text-center text-neutral-400">No entry</p>
			{/each}
		{/await}
	</div>
</div>
