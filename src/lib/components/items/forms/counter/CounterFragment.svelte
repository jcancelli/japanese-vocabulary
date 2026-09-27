<script lang="ts">
	import Labeled from "$lib/components/Labeled.svelte"
	import { Helper } from "flowbite-svelte"
	import Input from "flowbite-svelte/Input.svelte"

	export interface CounterFragmentProps {
		value: string
		error?: string | null | undefined
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), error, disabled, ...props }: CounterFragmentProps = $props()
</script>

<Labeled
	label="Counter"
	{...props}
>
	<Input
		type="text"
		placeholder="Counter"
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
