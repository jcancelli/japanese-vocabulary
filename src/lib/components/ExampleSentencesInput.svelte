<script lang="ts">
	import type { ExampleSentence } from "$lib/model"
	import FloatingLabelInput from "flowbite-svelte/FloatingLabelInput.svelte"
	import Helper from "flowbite-svelte/Helper.svelte"
	import Button from "flowbite-svelte/Button.svelte"
	import CloseButton from "flowbite-svelte/CloseButton.svelte"
	import PlusIcon from "flowbite-svelte-icons/PlusOutline.svelte"
	import { ExampleSentenceSchema } from "$lib/schema"
	import { ExampleSentenceDTO } from "$lib/dto.svelte"

	export interface ExampleSentencesInputProps {
		value: ExampleSentence[]
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), disabled, ...props }: ExampleSentencesInputProps = $props()

	let newEntry: ExampleSentence = $state({
		japanese: "",
		english: "",
	})
	let error: {
		japanese: string | null
		english: string | null
	} = $state({
		japanese: null,
		english: null,
	})

	function addNewExample() {
		clearError()

		const result = ExampleSentenceSchema.safeParse(newEntry)

		// Handle error
		if (result.error) {
			const { issues } = result.error
			for (const issue of issues) {
				const key = issue.path[0]
				if (key in error) {
					error[key as keyof typeof error] = issue.message
				} else {
					alert("Woops, check console")
					console.error(error)
				}
			}
			return
		}

		value.push(ExampleSentenceDTO.fromInterface(result.data))

		clearNewEntry()
		clearError()
	}

	function clearNewEntry() {
		newEntry = {
			japanese: "",
			english: "",
		}
	}

	function clearError() {
		error = {
			japanese: null,
			english: null,
		}
	}
</script>

<div {...props}>
	<!-- New meaning -->
	<div class="">
		<!-- Japanese -->
		<FloatingLabelInput
			bind:value={newEntry.japanese}
			color={error.japanese ? "red" : "default"}
			class="my-2"
		>
			Japanese
		</FloatingLabelInput>
		{#if error.japanese}
			<Helper color="red">
				{error.japanese}
			</Helper>
		{/if}
		<!-- English -->
		<FloatingLabelInput
			bind:value={newEntry.english}
			color={error.english ? "red" : "default"}
			class="my-2"
		>
			English
		</FloatingLabelInput>
		{#if error.english}
			<Helper color="red">
				{error.english}
			</Helper>
		{/if}
		<!-- Add example button -->
		<Button
			color="primary"
			class="mx-auto mt-4 block"
			onclick={addNewExample}
			outline
		>
			<PlusIcon />
		</Button>
	</div>
	<!-- Entries -->
	<div class="mt-4 flex flex-col gap-y-2">
		{#each value as entry, i}
			<div
				class="grid grid-cols-[1fr_min-content] grid-rows-2 items-center py-2 not-last:border-b"
			>
				<div class="py-2">
					<h4 class="font-semibold">Japanese</h4>
					<p>{entry.japanese}</p>
				</div>
				<div class="row-span-2 w-fit">
					<CloseButton onclick={() => value.splice(i, 1)} />
				</div>
				<div>
					<h4 class="font-semibold">English</h4>
					<p>{entry.english}</p>
				</div>
			</div>
		{:else}
			<p class="col-span-3 text-center text-neutral-500">No entries</p>
		{/each}
	</div>
</div>
