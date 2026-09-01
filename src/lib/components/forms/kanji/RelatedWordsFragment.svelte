<script lang="ts">
	import RelatedWordsInput from "$lib/components/kanji/RelatedWordsInput.svelte"
	import Labeled from "$lib/components/Labeled.svelte"
	import type { UUIDv4 } from "$lib/model"
	import { Helper } from "flowbite-svelte"

	export interface RelatedWordsFragmentProps {
		value: UUIDv4[]
		error?: string | null | undefined
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), error, disabled, ...props }: RelatedWordsFragmentProps = $props()
</script>

<Labeled
	label="Related words"
	{...props}
>
	<RelatedWordsInput
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
