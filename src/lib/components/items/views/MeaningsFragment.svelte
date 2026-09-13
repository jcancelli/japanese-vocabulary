<script lang="ts">
	import Labeled from "$lib/components/Labeled.svelte"
	import type { MeaningDTO } from "$lib/dto.svelte"

	export interface MeaningsFragmentProps {
		meanings: MeaningDTO[]
		class?: string | undefined
	}

	let { meanings, ...props }: MeaningsFragmentProps = $props()
</script>

<Labeled
	label="Meanings"
	class="text-center {props.class ?? ''}"
>
	{#if meanings.length > 0}
		<p>
			{meanings
				.map(({ meaning, note }) => (note ? `${meaning} (${note})` : meaning))
				.join(", ")}
		</p>
	{:else}
		<p class="text-neutral-400">-</p>
	{/if}
</Labeled>
