<script lang="ts">
	import Helper from "flowbite-svelte/Helper.svelte"
	import DifficultyInput from "../DifficultyInput.svelte"
	import type { Difficulty } from "$lib/model"
	import Labeled from "../Labeled.svelte"

	export interface DifficultyFragment {
		value: Difficulty
		error?: string | null | undefined
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), error, disabled, ...props }: DifficultyFragment = $props()
</script>

<Labeled
	label="Difficulty"
	{...props}
>
	<DifficultyInput
		bind:value
		{disabled}
		class="mx-auto"
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
