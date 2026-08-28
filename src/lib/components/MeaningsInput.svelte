<script lang="ts">
	import type { WordMeaning as WordMeaningDTO } from "$lib/model"
	import FloatingLabelInput from "flowbite-svelte/FloatingLabelInput.svelte"
	import Helper from "flowbite-svelte/Helper.svelte"
	import Button from "flowbite-svelte/Button.svelte"
	import CloseButton from "flowbite-svelte/CloseButton.svelte"
	import PlusIcon from "flowbite-svelte-icons/PlusOutline.svelte"
	import { WordMeaningSchema } from "$lib/schema"
	import { mapWordMeaningDataToDTO } from "$lib/database"

	export interface MeaningsInputProps {
		value: WordMeaningDTO[]
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), disabled, ...props }: MeaningsInputProps = $props()

	let newEntry: WordMeaningDTO = $state({
		meaning: "",
		note: "",
	})
	let error: {
		meaning: string | null
		note: string | null
	} = $state({
		meaning: null,
		note: null,
	})

	function addNewMeaning() {
		clearError()

		const result = WordMeaningSchema.safeParse(newEntry)

		// Handle error
		if (result.error) {
			const { issues } = result.error
			for (const issue of issues) {
				const key = issue.path[0]
				if (key in error) {
					error[key as keyof typeof error] = issue.message
				} else {
					alert("Woops, check the console")
					console.error(issue)
				}
			}
			return
		}

		value.push(mapWordMeaningDataToDTO(result.data))

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
		error = {
			meaning: null,
			note: null,
		}
	}
</script>

<div {...props}>
	<!-- New meaning -->
	<div class="">
		<FloatingLabelInput
			bind:value={newEntry.meaning}
			color={error.meaning ? "red" : "default"}
			class="my-2"
		>
			New meaning
		</FloatingLabelInput>
		{#if error.meaning}
			<Helper color="red">
				{error.meaning}
			</Helper>
		{/if}
		<FloatingLabelInput
			bind:value={newEntry.note}
			color={error.note ? "red" : "default"}
			class="my-2"
		>
			New meaning note
		</FloatingLabelInput>
		{#if error.note}
			<Helper color="red">
				{error.note}
			</Helper>
		{/if}
		<Button
			color="primary"
			class="mx-auto mt-4 block"
			onclick={addNewMeaning}
			outline
		>
			<PlusIcon />
		</Button>
	</div>
	<!-- Existing meanings -->
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
