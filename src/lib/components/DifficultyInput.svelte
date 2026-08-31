<script lang="ts">
	import { Difficulty } from "$lib/model"
	import { DIFFICULTY_PRETTY_STRING } from "$lib/strings"
	import Range from "flowbite-svelte/Range.svelte"

	export interface DifficultyInputProps {
		value: Difficulty
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), disabled, ...props }: DifficultyInputProps = $props()
</script>

<Range
	min={1}
	max={5}
	step={1}
	bind:value={() => value * -1 + 6, (v) => (value = v * -1 + 6)}
	{disabled}
	{...props}
/>
<p>{DIFFICULTY_PRETTY_STRING[value]}</p>
