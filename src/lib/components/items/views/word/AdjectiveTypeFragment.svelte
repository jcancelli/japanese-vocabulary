<script lang="ts">
	import Labeled from "$lib/components/Labeled.svelte"
	import type { AdjectiveType } from "$lib/model"
	import { ADJECTIVE_TYPE_PRETTY_STRING } from "$lib/strings"

	export interface AdjectiveTypeFragmentProps {
		adjectiveType?: AdjectiveType | undefined
		class?: string | undefined
	}

	let { adjectiveType, ...props }: AdjectiveTypeFragmentProps = $props()
</script>

<Labeled
	label="Adjective type"
	class="text-center {props.class ?? ''}"
>
	{#if adjectiveType !== undefined}
		<p>{ADJECTIVE_TYPE_PRETTY_STRING[adjectiveType]}</p>
	{:else}
		<p class="text-neutral-400">-</p>
	{/if}
</Labeled>
