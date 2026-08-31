<script lang="ts">
	import { getAllWords, getWords } from "$lib/database/words"
	import type { UUIDv4 } from "$lib/model"
	import Fuse from "fuse.js"
	import Search from "flowbite-svelte/Search.svelte"
	import Listgroup from "flowbite-svelte/Listgroup.svelte"
	import CloseButton from "flowbite-svelte/CloseButton.svelte"

	export interface RelatedWordsInputProps {
		wordId: UUIDv4
		relatedWordsIds: UUIDv4[]
	}

	let { wordId, relatedWordsIds = $bindable() }: RelatedWordsInputProps = $props()

	let searchTerm = $state("")

	const allWords = $derived(await getAllWords())
	const fuse = $derived(
		new Fuse(allWords ?? [], {
			keys: ["kanji", "kana", "meanings.meaning"],
		}),
	)
	const suggestions = $derived(
		fuse
			.search(searchTerm)
			// Exclude already related words and the word itself
			.filter((match) => !relatedWordsIds.includes(match.item.id) && match.item.id !== wordId)
			// Max 5 suggestions
			.slice(0, 5),
	)

	const relatedWords = $derived(await getWords(relatedWordsIds))

	function addRelatedWord(entryId: UUIDv4) {
		if (relatedWordsIds.includes(entryId)) {
			throw new Error()
		}
		relatedWordsIds.push(entryId)
		searchTerm = ""
	}
</script>

<div>
	<!-- Search input -->
	<div>
		<Search
			bind:value={searchTerm}
			placeholder="Search word"
			clearable
			clearableOnClick={() => (searchTerm = "")}
		/>
		{#if searchTerm !== ""}
			<Listgroup
				active
				items={suggestions.map((suggestion) => {
					const { id, kanji, kana, meanings } = suggestion.item
					return { name: `${kanji ?? kana} (${meanings[0].meaning})`, wordid: id }
				})}
				onclick={(e) => {
					const suggestedWordId = (
						e!.currentTarget as HTMLButtonElement
					).attributes.getNamedItem("wordid")?.nodeValue
					addRelatedWord(suggestedWordId as UUIDv4)
				}}
			/>
		{/if}
	</div>
	<!-- Entries -->
	<div class="grid grid-cols-[1fr_2.4rem] items-center p-4">
		{#each relatedWords as relatedWord, i (relatedWord.id)}
			<p class="text-sm">{relatedWord.primaryWriting} ({relatedWord.primaryMeaning})</p>
			<CloseButton
				onclick={() => relatedWordsIds.splice(i, 1)}
				class="w-fit"
			/>
		{:else}
			<p class="col-span-2 text-center">No entry</p>
		{/each}
	</div>
</div>
