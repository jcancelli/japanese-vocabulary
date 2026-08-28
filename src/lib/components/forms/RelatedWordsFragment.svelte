<script lang="ts">
	import type { UUIDv4 } from "$lib/model"
	import Helper from "flowbite-svelte/Helper.svelte"
	import RelatedWordsInput from "../RelatedWordsInput.svelte"
	import Labeled from "../Labeled.svelte"

	export interface RelatedWordsProps {
		value: UUIDv4[]
		wordId: UUIDv4
		error?: string | null | undefined
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), wordId, error, disabled, ...props }: RelatedWordsProps = $props()
</script>

<Labeled
	label="Related words"
	{...props}
>
	<RelatedWordsInput
		bind:relatedWordsIds={value}
		{wordId}
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
