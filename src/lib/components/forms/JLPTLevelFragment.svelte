<script lang="ts">
	import Helper from "flowbite-svelte/Helper.svelte"
	import JLPTLevelInput from "../JLPTLevelInput.svelte"
	import type { JLPTLevel } from "$lib/model"
	import Labeled from "../Labeled.svelte"

	export interface JLPTLevelFragmentProps {
		value: JLPTLevel
		error?: string | null | undefined
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), error, disabled, ...props }: JLPTLevelFragmentProps = $props()
</script>

<Labeled
	label="JLPT Level"
	{...props}
>
	<JLPTLevelInput
		bind:value
		{disabled}
		class="mx-auto"
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
