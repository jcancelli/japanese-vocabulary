<script lang="ts">
	import {
		AdjectiveDTO,
		AdverbDTO,
		NounDTO,
		PreNounAdjectivalDTO,
		VerbDTO,
	} from "$lib/dto.svelte"
	import { WordType } from "$lib/model"
	import type { PageProps } from "./$types"
	import ViewAdjectivePage from "./ViewAdjectivePage.svelte"
	import ViewAdverbPage from "./ViewAdverbPage.svelte"
	import ViewNounPage from "./ViewNounPage.svelte"
	import ViewPreNounAdjectivalPage from "./ViewPreNounAdjectivalPage.svelte"
	import ViewVerbPage from "./ViewVerbPage.svelte"

	let { data }: PageProps = $props()

	const word = $derived(data.word)
	const relatedWords = $derived(data.relatedWords)
	const relatedKanjis = $derived(data.relatedKanjis)
	const wordType = $derived(word.wordType)
</script>

{#if wordType === WordType.NOUN}
	<ViewNounPage
		word={word as NounDTO}
		{relatedWords}
		{relatedKanjis}
	/>
{:else if wordType === WordType.VERB}
	<ViewVerbPage
		word={word as VerbDTO}
		{relatedWords}
		{relatedKanjis}
	/>
{:else if wordType === WordType.ADVERB}
	<ViewAdverbPage
		word={word as AdverbDTO}
		{relatedWords}
		{relatedKanjis}
	/>
{:else if wordType === WordType.ADJECTIVE}
	<ViewAdjectivePage
		word={word as AdjectiveDTO}
		{relatedWords}
		{relatedKanjis}
	/>
{:else if wordType === WordType.PRE_NOUN_ADJECTIVAL}
	<ViewPreNounAdjectivalPage
		word={word as PreNounAdjectivalDTO}
		{relatedWords}
		{relatedKanjis}
	/>
{:else}
	UNKNOWN WORD TYPE
{/if}
