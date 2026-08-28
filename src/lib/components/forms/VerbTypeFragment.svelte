<script lang="ts">
	import type { VerbType } from "$lib/model"
	import Helper from "flowbite-svelte/Helper.svelte"
	import VerbTypeInput from "../VerbTypeInput.svelte"
	import Labeled from "../Labeled.svelte"

	export interface VerbTypeFragmentProps {
		value: VerbType
		error?: string | null | undefined
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), error, disabled, ...props }: VerbTypeFragmentProps = $props()
</script>

<Labeled
	label="Verb type"
	{...props}
>
	<VerbTypeInput
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
