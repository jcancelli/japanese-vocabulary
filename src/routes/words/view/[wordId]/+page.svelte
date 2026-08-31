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

	const word = $derived(data.word!)
	const relatedWords = $derived(data.relatedWords)
	const wordType = $derived(word.wordType)
</script>

{#if wordType === WordType.NOUN}
	<ViewNounPage
		word={word as NounDTO}
		{relatedWords}
	/>
{:else if wordType === WordType.VERB}
	<ViewVerbPage
		word={word as VerbDTO}
		{relatedWords}
	/>
{:else if wordType === WordType.ADVERB}
	<ViewAdverbPage
		word={word as AdverbDTO}
		{relatedWords}
	/>
{:else if wordType === WordType.ADJECTIVE}
	<ViewAdjectivePage
		word={word as AdjectiveDTO}
		{relatedWords}
	/>
{:else if wordType === WordType.PRE_NOUN_ADJECTIVAL}
	<ViewPreNounAdjectivalPage
		word={word as PreNounAdjectivalDTO}
		{relatedWords}
	/>
{:else}
	UNKNOWN WORD TYPE
{/if}
