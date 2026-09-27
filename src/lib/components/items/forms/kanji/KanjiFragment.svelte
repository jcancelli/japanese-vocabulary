<script lang="ts">
	import Labeled from "$lib/components/Labeled.svelte"
	import { Helper } from "flowbite-svelte"
	import Input from "flowbite-svelte/Input.svelte"

	export interface KanjiFragmentProps {
		value: string
		error?: string | null | undefined
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), error, disabled, ...props }: KanjiFragmentProps = $props()
</script>

<Labeled
	label="Kanji"
	{...props}
>
	<Input
		type="text"
		placeholder="Kanji"
		bind:value
		{disabled}
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
