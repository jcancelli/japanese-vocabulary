<script lang="ts">
	import Labeled from "$lib/components/Labeled.svelte"
	import { Helper } from "flowbite-svelte"
	import VariantsInput from "../../inputs/counter/VariantsInput.svelte"
	import type { CounterVariants } from "$lib/model"

	export interface VariantsFragmentProps {
		value?: CounterVariants
		error?: string | null | undefined
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), error, disabled, ...props }: VariantsFragmentProps = $props()
</script>

<Labeled
	label="Variants"
	{...props}
>
	<VariantsInput
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
