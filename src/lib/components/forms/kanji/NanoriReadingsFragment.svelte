<script lang="ts">
	import ReadingsInput from "$lib/components/kanji/ReadingsInput.svelte"
	import Labeled from "$lib/components/Labeled.svelte"
	import { Helper } from "flowbite-svelte"

	export interface NanoriReadingsFragmentProps {
		value: string[]
		error?: string | null | undefined
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), error, disabled, ...props }: NanoriReadingsFragmentProps = $props()
</script>

<Labeled
	label="Nanori readings"
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
