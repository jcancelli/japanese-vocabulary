<script lang="ts">
	import { WordDifficulty } from "$lib/model"
	import { WORD_DIFFICULTY_PRETTY_STRING } from "$lib/strings"
	import Range from "flowbite-svelte/Range.svelte"

	export interface WordDifficultyInputProps {
		value: WordDifficulty
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), disabled, ...props }: WordDifficultyInputProps = $props()
</script>

<Range
	min={1}
	max={5}
	step={1}
	bind:value={() => value * -1 + 6, (v) => (value = v * -1 + 6)}
	{disabled}
	{...props}
/>
<p>{WORD_DIFFICULTY_PRETTY_STRING[value]}</p>
