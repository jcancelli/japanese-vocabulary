<script lang="ts">
	import Labeled from "$lib/components/Labeled.svelte"
	import type { VerbType } from "$lib/model"
	import Helper from "flowbite-svelte/Helper.svelte"
	import VerbTypeInput from "../../VerbTypeInput.svelte"

	export interface VerbTypeFragmentProps {
		value?: VerbType | undefined
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
