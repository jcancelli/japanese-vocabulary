<script lang="ts">
	import { CounterDTO, KanjiDTO, WordDTO } from "$lib/dto.svelte"
	import type { PageProps } from "./$types"
	import ViewCounterPage from "./ViewCounterPage.svelte"
	import ViewKanjiPage from "./ViewKanjiPage.svelte"
	import ViewWordPage from "./ViewWordPage.svelte"

	let { data }: PageProps = $props()
	const item = $derived(data.item)
	const relatedWords = $derived(data.relatedWords)
	const relatedKanjis = $derived(data.relatedKanjis)
	const relatedCounters = $derived(data.relatedCounters)
</script>

{#if item instanceof WordDTO}
	<ViewWordPage
		word={item}
		{relatedWords}
		{relatedKanjis}
		{relatedCounters}
	/>
{:else if item instanceof KanjiDTO}
	<ViewKanjiPage
		kanji={item}
		{relatedWords}
		{relatedKanjis}
		{relatedCounters}
	/>
{:else if item instanceof CounterDTO}
	<ViewCounterPage
		counter={item}
		{relatedWords}
		{relatedKanjis}
		{relatedCounters}
	/>
{:else}
	<p class="mt-10 text-center">UNKNOWN ITEM TYPE {item.itemType}</p>
{/if}
