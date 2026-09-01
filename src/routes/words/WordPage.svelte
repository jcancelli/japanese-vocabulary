<script lang="ts">
	import { WORD_TYPE_PRETTY_STRING } from "$lib/strings"
	import type { Snippet } from "svelte"
	import { WORD_TYPE_COLOR } from "$lib/colors"
	import type { WordDTO } from "$lib/dto.svelte"
	import { resolve } from "$app/paths"
	import Tooltip from "flowbite-svelte/Tooltip.svelte"
	import HomeIcon from "flowbite-svelte-icons/HomeSolid.svelte"
	import WordListIcon from "flowbite-svelte-icons/AlignCenterOutline.svelte"

	export interface WordPageProps {
		word: WordDTO
		children: Snippet
		buttons: Snippet
	}

	let { word, children, buttons }: WordPageProps = $props()
</script>

<!-- Nav links, top-4 so that it's not over the word type stripe -->
<div class="fixed top-4 right-0 z-10 flex flex-row items-center justify-center gap-2 p-4">
	<!-- Words -->
	<a href={resolve("/words")}>
		<WordListIcon size="xl" />
	</a>
	<Tooltip>Word list</Tooltip>
	<!-- Home -->
	<a href={resolve("/")}>
		<HomeIcon size="xl" />
	</a>
	<Tooltip>Home</Tooltip>
</div>
<!-- Page -->
<div class="grid h-screen w-screen grid-cols-1 grid-rows-[min-content_1fr_min-content]">
	<!-- Word type stripe -->
	<div
		class="h-fit text-center text-white"
		style:background-color={WORD_TYPE_COLOR[word.wordType]}
	>
		{WORD_TYPE_PRETTY_STRING[word.wordType].toLowerCase()}
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
