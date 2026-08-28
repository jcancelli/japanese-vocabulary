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
	const wordType = $derived(word.wordType)
</script>

{#if wordType === WordType.NOUN}
	<ViewNounPage word={word as NounDTO} />
{:else if wordType === WordType.VERB}
	<ViewVerbPage word={word as VerbDTO} />
{:else if wordType === WordType.ADVERB}
	<ViewAdverbPage word={word as AdverbDTO} />
{:else if wordType === WordType.ADJECTIVE}
	<ViewAdjectivePage word={word as AdjectiveDTO} />
{:else if wordType === WordType.PRE_NOUN_ADJECTIVAL}
	<ViewPreNounAdjectivalPage word={word as PreNounAdjectivalDTO} />
{:else}
	UNKNOWN WORD TYPE
{/if}
