<script lang="ts">
	import Button from "flowbite-svelte/Button.svelte"
	import Input from "flowbite-svelte/Input.svelte"
	import Helper from "flowbite-svelte/Helper.svelte"
	import PlusIcon from "flowbite-svelte-icons/PlusOutline.svelte"
	import Labeled from "../Labeled.svelte"

	export interface KanjiFragmentProps {
		value: string | undefined
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
	{#if value === undefined}
		<div class="mx-auto w-fit">
			<Button
				color="primary"
				onclick={() => (value = value ?? "")}
				class="mx-auto"
				outline
				{disabled}
			>
				<PlusIcon /> Add kanji
			</Button>
		</div>
	{:else}
		<Input
			type="text"
			placeholder="Kanji"
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
		<button
			class="mx-auto mt-1 block cursor-pointer text-sm text-primary-600 underline"
			onclick={() => (value = undefined)}
		>
			remove kanji
		</button>
	{/if}
</Labeled>
