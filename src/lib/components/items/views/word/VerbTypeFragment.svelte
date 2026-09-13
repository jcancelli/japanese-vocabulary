<script lang="ts">
	import Labeled from "$lib/components/Labeled.svelte"
	import type { VerbType } from "$lib/model"
	import { VERB_TYPE_PRETTY_STRING } from "$lib/strings"

	export interface VerbTypeFragmentProps {
		verbType?: VerbType | undefined
		class?: string | undefined
	}

	let { verbType, ...props }: VerbTypeFragmentProps = $props()
</script>

<Labeled
	label="Verb type"
	class={props.class}
>
	{#if verbType !== undefined}
		<p>{VERB_TYPE_PRETTY_STRING[verbType]}</p>
	{:else}
		<p class="text-neutral-400">-</p>
	{/if}
</Labeled>
