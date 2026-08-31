<script lang="ts">
	import type { KanjiMeaning } from "$lib/model"
	import FloatingLabelInput from "flowbite-svelte/FloatingLabelInput.svelte"
	import Helper from "flowbite-svelte/Helper.svelte"
	import Button from "flowbite-svelte/Button.svelte"
	import CloseButton from "flowbite-svelte/CloseButton.svelte"
	import PlusIcon from "flowbite-svelte-icons/PlusOutline.svelte"
	import { KanjiMeaningSchema } from "$lib/schema"
	import { KanjiMeaningDTO } from "$lib/dto.svelte"

	export interface MeaningsInputProps {
		value: KanjiMeaning[]
		disabled?: boolean
		class?: string
	}

	type Errors = {
		[key in keyof KanjiMeaning]?: string
	}

	let { value = $bindable(), disabled, ...props }: MeaningsInputProps = $props()

	let newEntry: KanjiMeaning = $state({
		meaning: "",
		note: "",
	})
	let errors: Errors = $state({})

	function addNewMeaning() {
		clearError()

		const result = KanjiMeaningSchema.safeParse(newEntry)

		// Handle error
		if (result.error) {
			const { issues } = result.error
			for (const issue of issues) {
				const key = issue.path[0]
				if (key in errors) {
					errors[key as keyof typeof errors] = issue.message
				} else {
					alert("Woops, check the console")
					console.error(issue)
				}
			}
			return
		}

		value.push(KanjiMeaningDTO.fromInterface(result.data))

		clearNewEntry()
		clearError()
	}

	function clearNewEntry() {
		newEntry = {
			meaning: "",
			note: "",
		}
	}

	function clearError() {
		errors = {}
	}
</script>

<div {...props}>
	<!-- New meaning -->
	<div class="">
		<!-- New meaning input -->
		<FloatingLabelInput
			bind:value={newEntry.meaning}
			color={errors.meaning ? "red" : "default"}
			class="my-2"
		>
			New meaning
		</FloatingLabelInput>
		<!-- New meaning error -->
		{#if errors.meaning}
			<Helper color="red">
				{errors.meaning}
			</Helper>
		{/if}
		<!-- New meaning note input -->
		<FloatingLabelInput
			bind:value={newEntry.note}
			color={errors.note ? "red" : "default"}
			class="my-2"
		>
			New meaning note
		</FloatingLabelInput>
		<!-- New meaning note error -->
		{#if errors.note}
			<Helper color="red">
				{errors.note}
			</Helper>
		{/if}
		<!-- Add new meaning button -->
		<Button
			color="primary"
			class="mx-auto mt-4 block"
			onclick={addNewMeaning}
			outline
		>
			<PlusIcon />
		</Button>
	</div>
	<!-- Entries -->
	<div class="mt-4 grid grid-cols-[1fr_1fr_2.4rem] gap-y-2">
		<!-- Columns headers -->
		<h4 class="font-semibold">Meaning</h4>
		<h4 class="font- font-semibold">Note</h4>
		<div></div>
		<!-- Columns -->
		{#each value as entry, i}
			<p>{entry.meaning}</p>
			<p>{entry.note ?? "-"}</p>
			<div>
				<CloseButton onclick={() => value.splice(i, 1)} />
			</div>
		{:else}
			<p class="col-span-3 text-center text-neutral-500">No entries</p>
		{/each}
	</div>
</div>
