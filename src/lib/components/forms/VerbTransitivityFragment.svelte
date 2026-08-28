<script lang="ts">
	import type { VerbTransitivity } from "$lib/model"
	import Helper from "flowbite-svelte/Helper.svelte"
	import VerbTransitivityInput from "../VerbTransitivityInput.svelte"
	import Labeled from "../Labeled.svelte"

	export interface VerbTransitivityFragmentProps {
		value: VerbTransitivity
		error?: string | null | undefined
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), error, disabled, ...props }: VerbTransitivityFragmentProps = $props()
</script>

<Labeled
	label="Transitivity"
	{...props}
>
	<VerbTransitivityInput
		bind:value
		{disabled}
		class="mx-auto mt-2"
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
