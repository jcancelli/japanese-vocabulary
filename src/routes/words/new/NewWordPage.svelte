<script
	lang="ts"
	generics="TWord extends WordDTO"
>
	import { WORD_TYPE_PRETTY_STRING } from "$lib/strings"
	import Button from "flowbite-svelte/Button.svelte"
	import CreateIcon from "flowbite-svelte-icons/PlusOutline.svelte"
	import CancelIcon from "flowbite-svelte-icons/CloseOutline.svelte"
	import type { Snippet } from "svelte"
	import WordPage from "../WordPage.svelte"
	import type { WordDTO } from "$lib/dto.svelte"
	import { goto } from "$app/navigation"
	import { createWord } from "$lib/database"
	import type { ZodObject } from "zod"
	import type { Word } from "$lib/model"

	export interface NewWordPageProps<TWord extends WordDTO> {
		word: TWord
		Schema: ZodObject
		children: Snippet<[TWord, Errors<TWord>]>
	}

	export type Errors<TWord extends WordDTO> = {
		[key in keyof TWord]?: string | undefined
	}

	let { word, Schema, children }: NewWordPageProps<TWord> = $props()

	let errors: Errors<TWord> = $state({})

	async function oncreate() {
		clearErrors()

		const parseResult = Schema.safeParse(word)

		// Handle error
		if (parseResult.error) {
			const { issues } = parseResult.error
			for (const issue of issues) {
				const key = issue.path[0]
				if (key in word) {
					errors[key as keyof typeof errors] = issue.message
				} else {
					console.error(parseResult.error)
					alert("Woops, check the console")
				}
			}
			return
		}

		const newWord = parseResult.data as unknown as Word

		try {
			await createWord(newWord)
		} catch (err: any) {
			alert("Woops, check the console")
			throw err
		}
		// TODO: alert success/failure

		goto(`/words/view/${word.id}`)
	}

	function clearErrors() {
		errors = {}
	}
</script>

<svelte:head>
	<title>New {WORD_TYPE_PRETTY_STRING[word.wordType]}</title>
</svelte:head>

<WordPage {word}>
	{@render children(word, errors)}

	{#snippet buttons()}
		<Button
			color="primary"
			onclick={oncreate}
		>
			<CreateIcon /> Create
		</Button>
		<Button
			color="gray"
			href="/words"
		>
			<CancelIcon /> Cancel
		</Button>
	{/snippet}
</WordPage>
