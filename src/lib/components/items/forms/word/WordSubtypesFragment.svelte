<script lang="ts">
	import Labeled from "$lib/components/Labeled.svelte"
	import type { SimpleWordType } from "$lib/model"
	import Helper from "flowbite-svelte/Helper.svelte"
	import WordSubtypesInput from "../../WordSubtypesInput.svelte"

	export interface WordSubtypesFragmentProps {
		value: SimpleWordType[]
		error?: string | null | undefined
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), error, disabled, ...props }: WordSubtypesFragmentProps = $props()
</script>

<Labeled
	label="Word subtypes"
	{...props}
>
	<WordSubtypesInput
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
