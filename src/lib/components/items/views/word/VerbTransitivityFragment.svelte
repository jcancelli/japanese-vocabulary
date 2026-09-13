<script lang="ts">
	import Labeled from "$lib/components/Labeled.svelte"
	import type { VerbTransitivityDTO } from "$lib/dto.svelte"

	export interface VerbTransitivityFragmentProps {
		transitivity?: VerbTransitivityDTO | undefined
		class?: string | undefined
	}

	let { transitivity, ...props }: VerbTransitivityFragmentProps = $props()
</script>

<Labeled
	label="Transitivity"
	class={props.class}
>
	{#if transitivity}
		{#if transitivity.transitive && transitivity.intransitive}
			<p>Transitive & intransitive</p>
		{:else if transitivity.transitive}
			<p>Transitive</p>
		{:else if transitivity.intransitive}
			<p>Intransitive</p>
		{:else}
			INVALID TRANSITIVITY
		{/if}
	{:else}
		<p class="text-neutral-400">-</p>
	{/if}
</Labeled>
