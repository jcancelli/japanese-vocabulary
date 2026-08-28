<script lang="ts">
	import Helper from "flowbite-svelte/Helper.svelte"
	import type { WordMeaningDTO } from "$lib/dto.svelte"
	import MeaningsInput from "../MeaningsInput.svelte"
	import Labeled from "../Labeled.svelte"

	export interface WordMeaningsFragmentProps {
		value: WordMeaningDTO[]
		error?: string | null | undefined
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), error, disabled, ...props }: WordMeaningsFragmentProps = $props()
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
