<script lang="ts">
	import Helper from "flowbite-svelte/Helper.svelte"
	import type { ExampleSentence } from "$lib/model"
	import ExampleSentencesInput from "../ExampleSentencesInput.svelte"
	import Labeled from "$lib/components/Labeled.svelte"

	export interface ExampleSentencesFragmentProps {
		value: ExampleSentence[]
		error?: string | null | undefined
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), error, disabled, ...props }: ExampleSentencesFragmentProps = $props()
</script>

<Labeled
	label="Example sentences"
	{...props}
>
	<ExampleSentencesInput bind:value />
	{#if error}
		<Helper
			color="red"
			class="mt-2"
		>
			{error}
		</Helper>
	{/if}
</Labeled>
