<script lang="ts">
	import FloatingLabelInput from "flowbite-svelte/FloatingLabelInput.svelte"
	import Helper from "flowbite-svelte/Helper.svelte"
	import Button from "flowbite-svelte/Button.svelte"
	import CloseButton from "flowbite-svelte/CloseButton.svelte"
	import PlusIcon from "flowbite-svelte-icons/PlusOutline.svelte"
	import type { CounterVariants } from "$lib/model"
	import { KanjiStringSchema } from "$lib/schema"
	import z from "zod"

	export interface VariantsInputProps {
		value: CounterVariants
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), disabled, ...props }: VariantsInputProps = $props()

	const sortedKeyValues = $derived(Array.from(value.entries()).sort((a, b) => a[0] - b[0]))

	interface Entry {
		numeric: string
		writing: string
	}

	const EntrySchema = z.object({
		numeric: z.preprocess(
			(val: string) => {
				return parseInt(val)
			},
			z
				.int()
				.positive("Must be positive")
				.refine((n) => !value.has(n), "Duplicate value"),
		),
		writing: KanjiStringSchema,
	})

	let newEntry: Entry = $state({
		numeric: "",
		writing: "",
	})
	let error: {
		[key in keyof Entry]: string | null
	} = $state({
		numeric: null,
		writing: null,
	})

	function addNewVariant() {
		clearError()

		const result = EntrySchema.safeParse(newEntry)

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

		value.set(result.data.numeric, result.data.writing)

		clearNewEntry()
		clearError()
	}

	function clearNewEntry() {
		newEntry = {
			numeric: "",
			writing: "",
		}
	}

	function clearError() {
		error = {
			numeric: null,
			writing: null,
		}
	}
</script>

<div {...props}>
	<!-- New variant -->
	<div class="">
		<FloatingLabelInput
			bind:value={
				() => newEntry.numeric,
				(val) => {
					newEntry.numeric = val.replaceAll(/\D/g, "")
				}
			}
			color={error.numeric ? "red" : "default"}
			class="my-2"
		>
			Number
		</FloatingLabelInput>
		{#if error.numeric}
			<Helper color="red">
				{error.numeric}
			</Helper>
		{/if}
		<FloatingLabelInput
			bind:value={newEntry.writing}
			color={error.writing ? "red" : "default"}
			class="my-2"
		>
			Writing
		</FloatingLabelInput>
		{#if error.writing}
			<Helper color="red">
				{error.writing}
			</Helper>
		{/if}
		<Button
			color="primary"
			class="mx-auto mt-4 block"
			onclick={addNewVariant}
			outline
			disabled={newEntry.writing.trim().length === 0}
		>
			<PlusIcon />
		</Button>
	</div>
	<!-- Existing variants -->
	<div class="mt-4 grid grid-cols-[1fr_1fr_min-content] gap-y-2">
		<!-- Columns headers -->
		<h4 class="font-semibold">#</h4>
		<h4 class="font- font-semibold">Writing</h4>
		<div></div>
		<!-- Columns -->
		{#each sortedKeyValues as [n, writing]}
			<p>{n}</p>
			<p>{writing}</p>
			<div>
				<CloseButton onclick={() => value.delete(n)} />
			</div>
		{:else}
			<p class="col-span-3 text-center text-neutral-500">No entries</p>
		{/each}
	</div>
</div>
