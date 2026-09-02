<script lang="ts">
	import { Difficulty } from "$lib/model"
	import StarOutlineIcon from "flowbite-svelte-icons/StarOutline.svelte"
	import StarSolidIcon from "flowbite-svelte-icons/StarSolid.svelte"

	export interface DifficultyInputProps {
		value: Difficulty
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), disabled, ...props }: DifficultyInputProps = $props()
</script>

{#snippet StarButton(difficulty: Difficulty)}
	{@const isFilled = value <= difficulty}
	<button
		onclick={() => (value = difficulty)}
		{disabled}
		class="
			text-primary-600
			not-disabled:hover:scale-110
			not-disabled:hover:cursor-pointer
			not-disabled:active:scale-110
		"
	>
		{#if isFilled}
			<StarSolidIcon class="size-9" />
		{:else}
			<StarOutlineIcon class="size-9" />
		{/if}
	</button>
{/snippet}

<div class="flex w-fit flex-row flex-nowrap items-center justify-center {props.class ?? ''}">
	{@render StarButton(Difficulty.DONT_KNOW)}
	{@render StarButton(Difficulty.KINDA_DONT_KNOW)}
	{@render StarButton(Difficulty.KINDA_KNOW)}
	{@render StarButton(Difficulty.KNOW)}
	{@render StarButton(Difficulty.UNFORGETTABLE)}
</div>
