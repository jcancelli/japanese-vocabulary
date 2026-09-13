<script lang="ts">
	import Labeled from "$lib/components/Labeled.svelte"
	import type { SimpleWordType } from "$lib/model"
	import { WORD_SUBTYPE_PRETTY_STRING } from "$lib/strings"

	export interface WordSubtypesFragmentProps {
		wordSubtypes: SimpleWordType[]
		class?: string | undefined
	}

	let { wordSubtypes, ...props }: WordSubtypesFragmentProps = $props()
</script>

<Labeled
	label="Word types"
	class="text-center {props.class ?? ''}"
>
	{#if wordSubtypes.length > 0}
		<p>{wordSubtypes.map((t) => WORD_SUBTYPE_PRETTY_STRING[t]).join(", ")}</p>
	{:else}
		<p class="text-neutral-400">-</p>
	{/if}
</Labeled>
