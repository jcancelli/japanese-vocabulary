<script lang="ts">
	import Labeled from "$lib/components/Labeled.svelte"

	export interface ReadingsFragmentProps {
		label: string
		pronounciations: string[]
		class?: string | undefined
	}

	let { label, pronounciations, ...props }: ReadingsFragmentProps = $props()
</script>

<Labeled
	{label}
	class={props.class}
>
	{#if pronounciations.length > 0}
		<p>{pronounciations.join(", ")}</p>
	{:else}
		<p class="text-neutral-400">-</p>
	{/if}
</Labeled>
