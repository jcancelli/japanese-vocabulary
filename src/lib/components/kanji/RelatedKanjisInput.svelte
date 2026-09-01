<script lang="ts">
	import type { UUIDv4 } from "$lib/model"
	import Fuse from "fuse.js"
	import Search from "flowbite-svelte/Search.svelte"
	import Listgroup from "flowbite-svelte/Listgroup.svelte"
	import CloseButton from "flowbite-svelte/CloseButton.svelte"
	import { getAllKanjis, getKanjis } from "$lib/database/kanjis"

	export interface RelatedKanjisInputProps {
		value: UUIDv4[]
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), disabled, ...props }: RelatedKanjisInputProps = $props()

	let searchTerm = $state("")

	const allKanjis = $derived(await getAllKanjis())
	const fuse = $derived(
		new Fuse(allKanjis ?? [], {
			keys: ["kanji", "onyomi", "kunyomi", "nanori", "meanings.meaning"],
		}),
	)
	const suggestions = $derived.by(() => {
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

	const relatedKanjis = $derived(await getKanjis(value))

	function addRelatedKanji(entryId: UUIDv4) {
		if (value.includes(entryId)) {
			throw new Error()
		}
		value.push(entryId)
		searchTerm = ""
	}
</script>

<div {...props}>
	<!-- Search input -->
	<div>
		<Search
			bind:value={searchTerm}
			placeholder="Search kanjis"
			clearable
			clearableOnClick={() => (searchTerm = "")}
			{disabled}
		/>
		{#if searchTerm !== ""}
			<Listgroup
				active
				items={suggestions.map((suggestion) => {
					const { id, kanji, meanings } = suggestion.item
					return { name: `${kanji} (${meanings[0].meaning})`, kanjiid: id }
				})}
				onclick={(e) => {
					if (disabled) {
						return
					}
					const suggestedKanjiId = (
						e!.currentTarget as HTMLButtonElement
					).attributes.getNamedItem("kanjiid")?.nodeValue
					addRelatedKanji(suggestedKanjiId as UUIDv4)
				}}
			/>
		{/if}
	</div>
	<!-- Entries -->
	<div class="grid grid-cols-[1fr_2.4rem] items-center p-4">
		{#each relatedKanjis as relatedKanji, i (relatedKanji.id)}
			<p class="text-sm">{relatedKanji.kanji} ({relatedKanji.meanings[0].meaning})</p>
			<CloseButton
				onclick={() => value.splice(i, 1)}
				class="w-fit"
			/>
		{:else}
			<p class="col-span-2 text-center">No entry</p>
		{/each}
	</div>
</div>
