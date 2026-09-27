<script lang="ts">
	import Labeled from "$lib/components/Labeled.svelte"
	import type { ItemType, UUIDv4 } from "$lib/model"
	import { Helper } from "flowbite-svelte"
	import RelatedItemsInput from "../RelatedItemsInput.svelte"

	export interface RelatedItemsFragmentProps {
		value: UUIDv4[]
		error?: string | null | undefined
		itemId: UUIDv4
		relatedType: ItemType
		label: string
		disabled?: boolean
		class?: string
	}

	let {
		value = $bindable(),
		error,
		itemId,
		relatedType,
		label,
		disabled,
		...props
	}: RelatedItemsFragmentProps = $props()
</script>

<Labeled
	{label}
	{...props}
>
	<RelatedItemsInput
		bind:value
		{itemId}
		{relatedType}
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
