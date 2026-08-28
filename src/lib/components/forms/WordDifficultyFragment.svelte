<script lang="ts">
	import Helper from "flowbite-svelte/Helper.svelte"
	import WordDifficultyInput from "../WordDifficultyInput.svelte"
	import type { WordDifficulty } from "$lib/model"
	import Labeled from "../Labeled.svelte"

	export interface WordDifficultyFragment {
		value: WordDifficulty
		error?: string | null | undefined
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), error, disabled, ...props }: WordDifficultyFragment = $props()
</script>

<Labeled
	label="Difficulty"
	{...props}
>
	<WordDifficultyInput
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
