<script
	lang="ts"
	generics="TWord extends WordDTO"
>
	import { WORD_TYPE_PRETTY_STRING } from "$lib/strings"
	import Button from "flowbite-svelte/Button.svelte"
	import Modal from "flowbite-svelte/Modal.svelte"
	import UpdateIcon from "flowbite-svelte-icons/FloppyDiskSolid.svelte"
	import DeleteIcon from "flowbite-svelte-icons/TrashBinSolid.svelte"
	import CancelIcon from "flowbite-svelte-icons/CloseOutline.svelte"
	import type { Snippet } from "svelte"
	import WordPage from "../WordPage.svelte"
	import type { WordDTO } from "$lib/dto.svelte"
	import { goto } from "$app/navigation"
	import { deleteWord, updateWord } from "$lib/database/words"
	import type { ZodObject } from "zod"
	import type { Word } from "$lib/model"
	import { resolve } from "$app/paths"
	import ErrorsFeed from "$lib/components/ErrorsFeed.svelte"

	export interface EditWordPageProps<TWord extends WordDTO> {
		word: TWord
		Schema: ZodObject
		children: Snippet<[TWord, Errors<TWord>]>
	}

	export type Errors<TWord extends WordDTO> = {
		[key in keyof TWord]?: string | undefined
	}

	let { word, Schema, children }: EditWordPageProps<TWord> = $props()

	let errorsFeed: ErrorsFeed
	let errors: Errors<TWord> = $state({})
	let showDeleteModal = $state(false)

	async function onedit() {
		clearErrors()

		const parseResult = Schema.safeParse(word)

		// Handle parse errors
		if (parseResult.error) {
			const { issues } = parseResult.error
			for (const issue of issues) {
				const key = issue.path[0]
				if (key in word) {
					errors[key as keyof typeof errors] = issue.message
				} else {
					errorsFeed.addError("Unexpected error while editing the word")
					console.error(parseResult.error)
				}
			}
			return
		}

		const editedWord = parseResult.data as unknown as Word

		try {
			await updateWord(editedWord)
		} catch (err: any) {
			errorsFeed.addError("Unexpected error while editing the word")
			console.error(err)
			return
		}

		goto(resolve("/words/view/[wordId]", { wordId: word.id }))
	}

	async function ondelete() {
		try {
			await deleteWord(word.id)
		} catch (err: any) {
			errorsFeed.addError("Unexpected error while deleting the word")
			console.error(err)
			return
		}
		goto(resolve("/words"))
	}

	function clearErrors() {
		errors = {}
	}
</script>

<svelte:head>
	<title>Edit {WORD_TYPE_PRETTY_STRING[word.wordType]}</title>
</svelte:head>

<WordPage {word}>
	{@render children(word, errors)}

	{#snippet buttons()}
		<Button
			color="secondary"
			onclick={onedit}
		>
			<UpdateIcon /> Update
		</Button>
		<Button
			color="red"
			onclick={() => (showDeleteModal = true)}
		>
			<DeleteIcon /> Delete
		</Button>
		<Button
			color="gray"
			href={resolve("/words/view/[wordId]", { wordId: word.id })}
		>
			<CancelIcon /> Cancel
		</Button>
	{/snippet}
</WordPage>

<Modal
	bind:open={showDeleteModal}
	title="Confirm deletion"
>
	<p>
		Do you really want to delete the {WORD_TYPE_PRETTY_STRING[word.wordType].toLowerCase()}
		<span class="font-bold">
			{word.primaryWriting} ({word.primaryMeaning})
		</span>
	</p>

	{#snippet footer()}
		<Button
			color="red"
			onclick={ondelete}
		>
			<DeleteIcon /> Delete
		</Button>
		<Button
			color="gray"
			onclick={() => (showDeleteModal = false)}
		>
			Cancel
		</Button>
	{/snippet}
</Modal>

<ErrorsFeed
	bind:this={errorsFeed}
	autoDismissTimeoutMs={5000}
/>
