<script lang="ts">
	import RelatedKanjisInput from "$lib/components/RelatedKanjisInput.svelte"
	import Labeled from "$lib/components/Labeled.svelte"
	import type { UUIDv4 } from "$lib/model"
	import { Helper } from "flowbite-svelte"

	export interface RelatedKanjisFragmentProps {
		value: UUIDv4[]
		error?: string | null | undefined
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), error, disabled, ...props }: RelatedKanjisFragmentProps = $props()
</script>

<Labeled
	label="Related kanjis"
	{...props}
>
	<RelatedKanjisInput
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
