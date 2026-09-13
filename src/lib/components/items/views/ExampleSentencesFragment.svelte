<script lang="ts">
	import Labeled from "$lib/components/Labeled.svelte"
	import type { ExampleSentenceDTO } from "$lib/dto.svelte"

	export interface ExampleSentencesFragmentProps {
		examples: ExampleSentenceDTO[]
		class?: string | undefined
	}

	let { examples, ...props }: ExampleSentencesFragmentProps = $props()
</script>

<Labeled
	label="Examples"
	class=" {props.class ?? ''}"
>
	<div class="grid grid-cols-2">
		{#each examples as { english, japanese }}
			<p>{japanese}</p>
			<p>{english}</p>
		{:else}
			<p class="col-span-2 text-center text-neutral-400">No examples</p>
		{/each}
	</div>
</Labeled>
