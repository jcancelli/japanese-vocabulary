<script lang="ts">
	import Helper from "flowbite-svelte/Helper.svelte"
	import AdjectiveTypeInput from "../AdjectiveTypeInput.svelte"
	import type { AdjectiveType } from "$lib/model"
	import Labeled from "../Labeled.svelte"

	export interface AdjectiveTypeFragmentProps {
		value: AdjectiveType
		error?: string | null | undefined
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), error, disabled, ...props }: AdjectiveTypeFragmentProps = $props()
</script>

<Labeled
	label="Adjective type"
	{...props}
>
	<AdjectiveTypeInput
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
