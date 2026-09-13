<script lang="ts">
	import {
		AdjectiveDTO,
		SimpleWordDTO,
		VerbDTO,
		type CounterDTO,
		type KanjiDTO,
		type WordDTO,
	} from "$lib/dto.svelte"
	import ViewSimpleWordPage from "./ViewSimpleWordPage.svelte"
	import ViewVerbPage from "./ViewVerbPage.svelte"
	import ViewAdjectivePage from "./ViewAdjectivePage.svelte"

	export interface ViewWordPageProps {
		word: WordDTO
		relatedWords: WordDTO[]
		relatedKanjis: KanjiDTO[]
		relatedCounters: CounterDTO[]
	}

	let { word, relatedWords, relatedKanjis, relatedCounters }: ViewWordPageProps = $props()
</script>

{#if word instanceof SimpleWordDTO}
	<ViewSimpleWordPage
		simpleWord={word}
		{relatedWords}
		{relatedKanjis}
		{relatedCounters}
	/>
{:else if word instanceof VerbDTO}
	<ViewVerbPage
		verb={word}
		{relatedWords}
		{relatedKanjis}
		{relatedCounters}
	/>
{:else if word instanceof AdjectiveDTO}
	<ViewAdjectivePage
		adjective={word}
		{relatedWords}
		{relatedKanjis}
		{relatedCounters}
	/>
{:else}
	<p class="text-center">UNKNOWN WORD TYPE {word.wordType}</p>
{/if}
