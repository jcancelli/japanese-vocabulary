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
	import EditAdjectivePage from "./EditAdjectivePage.svelte"
	import EditAdverbPage from "./EditAdverbPage.svelte"
	import EditNounPage from "./EditNounPage.svelte"
	import EditPreNounAdjectivalPage from "./EditPreNounAdjectivalPage.svelte"
	import EditVerbPage from "./EditVerbPage.svelte"

	let { data }: PageProps = $props()

	const word = $derived(data.word!)
	const wordType = $derived(word.wordType)
</script>

{#if wordType === WordType.NOUN}
	<EditNounPage word={word as NounDTO} />
{:else if wordType === WordType.VERB}
	<EditVerbPage word={word as VerbDTO} />
{:else if wordType === WordType.ADVERB}
	<EditAdverbPage word={word as AdverbDTO} />
{:else if wordType === WordType.ADJECTIVE}
	<EditAdjectivePage word={word as AdjectiveDTO} />
{:else if wordType === WordType.PRE_NOUN_ADJECTIVAL}
	<EditPreNounAdjectivalPage word={word as PreNounAdjectivalDTO} />
{:else}
	UNKNOWN WORD TYPE
{/if}
