<script lang="ts">
	import { CounterDTO, KanjiDTO, WordDTO } from "$lib/dto.svelte"
	import type { PageProps } from "./$types"
	import EditCounterPage from "./EditCounterPage.svelte"
	import EditKanjiPage from "./EditKanjiPage.svelte"
	import EditWordPage from "./EditWordPage.svelte"

	let { data }: PageProps = $props()
	const item = $derived(data.item)
</script>

{#if item instanceof WordDTO}
	<EditWordPage word={item} />
{:else if item instanceof KanjiDTO}
	<EditKanjiPage kanji={item} />
{:else if item instanceof CounterDTO}
	<EditCounterPage counter={item} />
{:else}
	<p class="mt-10 text-center">UNKNOWN ITEM TYPE {item.itemType}</p>
{/if}
