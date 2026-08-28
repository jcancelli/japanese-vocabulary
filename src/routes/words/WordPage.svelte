<script lang="ts">
	import { WORD_TYPE_PRETTY_STRING } from "$lib/strings"
	import type { Snippet } from "svelte"
	import { WORD_TYPE_COLOR } from "$lib/colors"
	import type { WordDTO } from "$lib/dto.svelte"

	export interface WordPageProps {
		word: WordDTO
		children: Snippet
		buttons: Snippet
	}

	let { word, children, buttons }: WordPageProps = $props()
</script>

<div class="grid h-screen w-screen grid-cols-1 grid-rows-[min-content_1fr_min-content]">
	<div
		class="h-fit text-center text-white"
		style:background-color={WORD_TYPE_COLOR[word.wordType]}
	>
		{WORD_TYPE_PRETTY_STRING[word.wordType].toLowerCase()}
	</div>

	<main class="flex flex-col gap-6 overflow-auto p-6">
		{@render children()}
	</main>

	{#if buttons}
		<div class="flex flex-col flex-nowrap gap-2 px-1 py-3">
			{@render buttons()}
		</div>
	{/if}
</div>
