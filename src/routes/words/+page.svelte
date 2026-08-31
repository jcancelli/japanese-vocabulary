<script lang="ts">
	import { getAllWords } from "$lib/database/words"
	import Fuse from "fuse.js"
	import SearchInput from "flowbite-svelte/Search.svelte"
	import HomeIcon from "flowbite-svelte-icons/HomeSolid.svelte"
	import NewItemWidget from "$lib/components/NewItemWidget.svelte"
	import { resolve } from "$app/paths"

	const words = $state(await getAllWords())

	let searchInput = $state("")

	const fuse = $derived(
		new Fuse(words, {
			includeScore: true,
			keys: ["kanji", "kana", "meanings.meaning"],
		}),
	)

	const searchResults = $derived(
		fuse
			.search(searchInput)
			.sort((a, b) => a.score! - b.score!)
			.map((e) => e.item),
	)
</script>

<svelte:head>
	<title>Words</title>
</svelte:head>

<!-- Top bar -->
<div class="sticky top-0 z-10 flex flex-row flex-nowrap gap-1 bg-neutral-50 p-4">
	<!-- Search input -->
	<SearchInput
		bind:value={searchInput}
		placeholder="Search word"
		clearable
		clearableOnClick={() => (searchInput = "")}
	/>
	<!-- Home button -->
	<a
		href={resolve("/")}
		class="flex size-12 items-center justify-center"
	>
		<HomeIcon
			size="xl"
			class="mx-auto"
		/>
	</a>
</div>
<!-- Content -->
<main class="w-screen p-4 pt-0">
	<div
		role="table"
		class="relative grid w-full grid-cols-[4fr_6fr] px-3"
	>
		<!-- Headers -->
		<h3 class="text-md p-2 text-start font-bold">Japanese</h3>
		<h3 class="text-md p-2 text-start font-bold">English</h3>
		<!-- Entries -->
		{#each searchResults as word, i}
			{@const { meaning, note } = word.meanings[0]}
			<!-- Word -->
			<a
				href={resolve("/words/view/[wordId]", { wordId: word.id })}
				class="cursor-pointer py-2 pr-0.5 pl-2 hover:underline nth-[4n-1]:bg-neutral-100"
			>
				{word.primaryWriting}
			</a>
			<a
				href={resolve("/words/view/[wordId]", { wordId: word.id })}
				class="cursor-pointer overflow-hidden px-0.5 py-2 text-ellipsis whitespace-nowrap hover:underline nth-[4n]:bg-neutral-100"
			>
				{note ? `${meaning} (${note.toLowerCase()})` : meaning}
			</a>
		{:else}
			<!-- No entry -->
			<p class="col-span-2 p-2 text-center text-neutral-700">
				{#if searchInput !== ""}
					No entry matching <span class="font-bold">
						"{searchInput}"
					</span>
				{:else}
					No entry
				{/if}
			</p>
		{/each}
	</div>
</main>

<!-- New word button -->
<NewItemWidget class="absolute right-4 bottom-4" />
