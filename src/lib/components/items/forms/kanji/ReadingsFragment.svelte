<script lang="ts">
	import Labeled from "$lib/components/Labeled.svelte"
	import { Helper } from "flowbite-svelte"
	import ReadingsInput from "../../inputs/kanji/ReadingsInput.svelte"

	export interface ReadingsFragmentProps {
		label: string
		value: string[]
		error?: string | null | undefined
		disabled?: boolean
		class?: string
	}

	let { label, value = $bindable(), error, disabled, ...props }: ReadingsFragmentProps = $props()
</script>

<Labeled
	{label}
	{...props}
>
	<ReadingsInput
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
