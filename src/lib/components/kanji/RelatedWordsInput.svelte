<script lang="ts">
	import { getAllWords, getWords } from "$lib/database/words"
	import type { UUIDv4 } from "$lib/model"
	import Fuse from "fuse.js"
	import Search from "flowbite-svelte/Search.svelte"
	import Listgroup from "flowbite-svelte/Listgroup.svelte"
	import CloseButton from "flowbite-svelte/CloseButton.svelte"

	export interface RelatedWordsInputProps {
		value: UUIDv4[]
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), disabled, ...props }: RelatedWordsInputProps = $props()

	let searchTerm = $state("")

	const fusePromise = $derived(
		getAllWords().then(
			(words) => new Fuse(words, { keys: ["kanji", "kana", "meanings.meaning"] }),
		),
	)
	const suggestionsPromise = $derived(
		fusePromise.then((fuse) => {
			const excludeIds = new Set(value)
			return (
				fuse
					.search(searchTerm)
					// Exclude already related words
					.filter((match) => !excludeIds.has(match.item.id))
					// Max 5 suggestions
					.slice(0, 5)
			)
		}),
	)
	const relatedWordsPromise = $derived(getWords(value))

	function addRelatedWord(entryId: UUIDv4) {
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
			placeholder="Search word"
			clearable
			clearableOnClick={() => (searchTerm = "")}
			{disabled}
		/>
		{#if searchTerm !== ""}
			{#await suggestionsPromise then suggestions}
				<Listgroup
					active
					items={suggestions.map((suggestion) => {
						const { id, kanji, kana, meanings } = suggestion.item
						return { name: `${kanji ?? kana} (${meanings[0].meaning})`, wordid: id }
					})}
					onclick={(e) => {
						if (disabled) {
							return
						}
						const suggestedWordId = (
							e!.currentTarget as HTMLButtonElement
						).attributes.getNamedItem("wordid")?.nodeValue
						addRelatedWord(suggestedWordId as UUIDv4)
					}}
				/>
			{/await}
		{/if}
	</div>
	<!-- Entries -->
	<div class="grid grid-cols-[1fr_2.4rem] items-center p-4">
		{#await relatedWordsPromise then relatedWords}
			{#each relatedWords as relatedWord, i (relatedWord.id)}
				<p class="text-sm">{relatedWord.primaryWriting} ({relatedWord.primaryMeaning})</p>
				<CloseButton
					onclick={() => value.splice(i, 1)}
					class="w-fit"
				/>
			{:else}
				<p class="col-span-2 text-center">No entry</p>
			{/each}
		{/await}
	</div>
</div>
