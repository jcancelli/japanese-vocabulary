<script lang="ts">
	import Helper from "flowbite-svelte/Helper.svelte"
	import Tags from "flowbite-svelte/Tags.svelte"
	import Labeled from "../Labeled.svelte"

	export interface TagsFragmentProps {
		value: string[]
		error?: string | null | undefined
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), error, disabled, ...props }: TagsFragmentProps = $props()
</script>

<Labeled
	label="Tags"
	{...props}
>
	<Tags
		bind:value
		{disabled}
		unique
		showHelper
		color={error ? "red" : "default"}
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
