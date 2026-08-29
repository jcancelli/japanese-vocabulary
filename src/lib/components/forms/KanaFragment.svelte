<script lang="ts">
	import Input from "flowbite-svelte/Input.svelte"
	import Helper from "flowbite-svelte/Helper.svelte"
	import Labeled from "../Labeled.svelte"

	export interface KanaFragmentProps {
		value: string
		error?: string | null | undefined
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), error, disabled, ...props }: KanaFragmentProps = $props()
</script>

<Labeled
	label="Kana"
	{...props}
>
	<Input
		type="text"
		placeholder="Kana"
		color={error ? "red" : "default"}
		{disabled}
		bind:value
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
