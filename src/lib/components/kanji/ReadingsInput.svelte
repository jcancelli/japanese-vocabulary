<script lang="ts">
	import Helper from "flowbite-svelte/Helper.svelte"
	import Button from "flowbite-svelte/Button.svelte"
	import FloatingLabelInput from "flowbite-svelte/FloatingLabelInput.svelte"
	import PlusIcon from "flowbite-svelte-icons/PlusOutline.svelte"
	import CloseButton from "flowbite-svelte/CloseButton.svelte"
	import { HiraganaStringSchema } from "$lib/schema"

	export interface ReadingsInputProps {
		value: string[]
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), disabled, ...props }: ReadingsInputProps = $props()

	let newEntry = $state("")
	let error: string | null = $state(null)

	function addNewReading() {
		clearError()

		const result = HiraganaStringSchema.safeParse(newEntry)

		// Handle error
		if (result.error) {
			const { issues } = result.error
			error = issues[0].message
			return
		}

		value.push(result.data)

		clearNewEntry()
		clearError()
	}

	function clearNewEntry() {
		newEntry = ""
	}

	function clearError() {
		error = null
	}
</script>

<div class=" {props.class ?? ''}">
	<!-- New reading -->
	<div>
		<!-- New reading input -->
		<FloatingLabelInput
			bind:value={newEntry}
			color={error ? "red" : "default"}
			class="my-2"
		>
			New reading
		</FloatingLabelInput>
		<!-- New reading error -->
		{#if error}
			<Helper
				color="red"
				class="mt-2"
			>
				{error}
			</Helper>
		{/if}
		<!-- Add button -->
		<Button
			color="primary"
			class="mx-auto mt-4 block"
			outline
			onclick={addNewReading}
		>
			<PlusIcon />
		</Button>
	</div>
	<!-- Entries -->
	<div class="mt-4 grid grid-cols-[1fr_1fr_2.4rem] gap-y-2">
		{#each value as entry, i}
			<p>{entry}</p>
			<div>
				<CloseButton onclick={() => value.splice(i, 1)} />
			</div>
		{:else}
			<p class="col-span-3 text-center text-neutral-500">No entries</p>
		{/each}
	</div>
</div>
