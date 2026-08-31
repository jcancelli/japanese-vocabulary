<script lang="ts">
	import MeaningsInput from "$lib/components/kanji/MeaningsInput.svelte"
	import Labeled from "$lib/components/Labeled.svelte"
	import type { KanjiMeaning } from "$lib/model"
	import { Helper } from "flowbite-svelte"

	export interface MeaningsFragmentProps {
		value: KanjiMeaning[]
		error?: string | null | undefined
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), error, disabled, ...props }: MeaningsFragmentProps = $props()
</script>

<Labeled
	label="Meanings"
	{...props}
>
	<MeaningsInput
		bind:value
		{disabled}
	/>
	{#if error}
		<Helper
			color="red"
			class="mt-2"
		>
			{error}
		</Helper>
	{/if}
</Labeled>
