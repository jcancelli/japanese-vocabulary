<script lang="ts">
	import { resolve } from "$app/paths"
	import { Search } from "flowbite-svelte"
	import type { PageProps } from "./$types"
	import HomeIcon from "flowbite-svelte-icons/HomeSolid.svelte"
	import Fuse from "fuse.js"
	import { ItemDTO } from "$lib/dto.svelte"
	import { itemIsWord, ItemType, JLPTLevel, type Difficulty } from "$lib/model"
	import NewItemWidget from "$lib/components/NewItemWidget.svelte"
	import { SvelteSet } from "svelte/reactivity"
	import SearchParams from "./SearchParams.svelte"
	import { ITEM_TYPE_PRETTY_STRING, WORD_TYPE_PRETTY_STRING } from "$lib/strings"
	import { ITEM_TYPE_COLOR } from "$lib/colors"

	let { data }: PageProps = $props()

	const items = $derived(data.items)

	let searchValue = $state("")
	let searchExpanded = $state(false)
	let includeTypes = $state(new SvelteSet([ItemType.WORD, ItemType.KANJI, ItemType.COUNTER]))
	let includeTags: Set<string> = $state(new SvelteSet([]))
	let includeDifficulties: Set<Difficulty> = $state(new SvelteSet([1, 2, 3, 4, 5]))
	let includeJlptLevels: Set<JLPTLevel | undefined> = $state(
		new SvelteSet([
			JLPTLevel.N1,
			JLPTLevel.N2,
			JLPTLevel.N3,
			JLPTLevel.N4,
			JLPTLevel.N5,
			undefined,
		]),
	)

	const fuse = $derived(
		new Fuse(items, {
			keys: ["searchStrings"],
		}),
	)
	const searchResults = $derived(
		fuse
			.search(searchValue)
			.map((it) => it.item)
			.filter((item) => {
				return (
					includeTypes.has(item.itemType)
					&& includeDifficulties.has(item.difficulty)
					&& includeJlptLevels.has(item.jlptLevel)
					&& (includeTags.size === 0 || item.tags.some((tag) => includeTags.has(tag)))
				)
			}),
	)
</script>

<svelte:head>
	<title>Vocabulary</title>
</svelte:head>

<!-- Search -->
<div>
	<div class="grid grid-cols-[1fr_min-content] px-3 pt-3">
		<!-- Search input -->
		<Search
			bind:value={searchValue}
			placeholder="Kanji, kana or english"
			clearable
			clearableOnClick={() => (searchValue = "")}
		/>
		<!-- Link to home -->
		<a
			href={resolve("/")}
			class="flex size-12 items-center justify-center"
		>
			<HomeIcon size="xl" />
		</a>
	</div>
	<!-- Advanced search -->
	<div>
		<!-- Advanced search controls -->
		{#if searchExpanded}
			<SearchParams
				types={includeTypes}
				tags={includeTags}
				difficulties={includeDifficulties}
				jlptLevels={includeJlptLevels}
			/>
		{/if}
		<!-- Expand/collapse advanced search -->
		<div class="py-1">
			<button
				class="mx-auto block cursor-pointer text-sm text-primary-600 hover:underline active:underline"
				onclick={() => (searchExpanded = !searchExpanded)}
			>
				{#if searchExpanded}
					less
				{:else}
					more
				{/if}
			</button>
		</div>
	</div>
</div>

<!-- Content -->
<main class="max-w-s">
	<div
		role="table"
		class="relative flex flex-col items-center justify-center"
	>
		<!-- Entries -->
		{#each searchResults as item}
			<!-- Item type indicator snippet -->
			{#snippet ItemTypeIndicator(item: ItemDTO)}
				<p
					style:color={ITEM_TYPE_COLOR[item.itemType]}
					class="drop-shadow-xs text-shadow-neutral-600"
				>
					{#if itemIsWord(item)}
						{WORD_TYPE_PRETTY_STRING[item.wordType].toLowerCase()}
					{:else}
						{ITEM_TYPE_PRETTY_STRING[item.itemType].toLowerCase()}
					{/if}
				</p>
			{/snippet}
			<!-- Entry -->
			<a
				href={resolve("/items/view/[itemId]", { itemId: item.id })}
				class="grid w-full grid-cols-[2fr_2fr_1fr] border-neutral-300 px-4 py-1.5 not-last:border-b hover:underline active:underline"
			>
				<p class="">{item.primaryWriting}</p>
				<p class="">{item.primaryMeaning.meaning}</p>
				{@render ItemTypeIndicator(item)}
			</a>
		{:else}
			<!-- No entry -->
			<p class="p-2 text-center text-neutral-700">
				{#if searchValue !== ""}
					No entry matching <span class="font-bold">
						"{searchValue}"
					</span>
				{:else}
					No entry
				{/if}
			</p>
		{/each}
	</div>
</main>

<!-- New item widget -->
<NewItemWidget class="absolute right-4 bottom-4" />
