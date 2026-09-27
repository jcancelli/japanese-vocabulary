<script lang="ts">
	import { AdjectiveDTO, SimpleWordDTO, VerbDTO, type WordDTO } from "$lib/dto.svelte"
	import EditSimpleWordPage from "./EditSimpleWordPage.svelte"
	import EditVerbPage from "./EditVerbPage.svelte"
	import EditAdjectivePage from "./EditAdjectivePage.svelte"

	export interface EditWordPageProps {
		word: WordDTO
	}

	let { word }: EditWordPageProps = $props()
</script>

{#if word instanceof SimpleWordDTO}
	<EditSimpleWordPage simpleWord={word} />
{:else if word instanceof VerbDTO}
	<EditVerbPage verb={word} />
{:else if word instanceof AdjectiveDTO}
	<EditAdjectivePage adjective={word} />
{:else}
	<p class="text-center">UNKNOWN WORD TYPE {word.wordType}</p>
{/if}
