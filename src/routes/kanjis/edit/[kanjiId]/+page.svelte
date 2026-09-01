<script lang="ts">
	import { goto } from "$app/navigation"
	import { resolve } from "$app/paths"
	import { deleteKanji, updateKanji } from "$lib/database/kanjis"
	import type { Kanji } from "$lib/model"
	import { KanjiSchema } from "$lib/schema"
	import KanjiPage from "../../KanjiPage.svelte"
	import Button from "flowbite-svelte/Button.svelte"
	import ErrorsFeed from "$lib/components/ErrorsFeed.svelte"
	import TagsFragment from "$lib/components/forms/TagsFragment.svelte"
	import DifficultyFragment from "$lib/components/forms/DifficultyFragment.svelte"
	import JLPTLevelFragment from "$lib/components/forms/JLPTLevelFragment.svelte"
	import OnyomiReadingsFragment from "$lib/components/forms/kanji/OnyomiReadingsFragment.svelte"
	import KanjiFragment from "$lib/components/forms/kanji/KanjiFragment.svelte"
	import KunyomiReadingsFragment from "$lib/components/forms/kanji/KunyomiReadingsFragment.svelte"
	import NanoriReadingsFragment from "$lib/components/forms/kanji/NanoriReadingsFragment.svelte"
	import MeaningsFragment from "$lib/components/forms/kanji/MeaningsFragment.svelte"
	import RelatedWordsFragment from "$lib/components/forms/kanji/RelatedWordsFragment.svelte"
	import RelatedKanjisFragment from "$lib/components/forms/kanji/RelatedKanjisFragment.svelte"
	import type { PageProps } from "./$types"
	import Modal from "flowbite-svelte/Modal.svelte"
	import UpdateIcon from "flowbite-svelte-icons/FloppyDiskSolid.svelte"
	import DeleteIcon from "flowbite-svelte-icons/TrashBinSolid.svelte"

	type Errors = {
		[key in keyof Kanji]?: string | undefined | null
	}

	let { data }: PageProps = $props()
	let kanji = $state(data.kanji)
	let errors: Errors = $state({})
	let showDeleteModal = $state(false)
	let errorsFeed: ErrorsFeed

	async function onedit() {
		clearErrors()

		const parseResult = KanjiSchema.safeParse(kanji)

		// Handle parse errors
		if (parseResult.error) {
			const { issues } = parseResult.error
			for (const issue of issues) {
				const key = issue.path[0]
				if (key in kanji) {
					errors[key as keyof typeof errors] = issue.message
				} else {
					errorsFeed.addError("Unexpected error while updating the kanji")
					console.error(parseResult.error)
				}
			}
			return
		}

		const editedKanji = parseResult.data as unknown as Kanji

		try {
			await updateKanji(editedKanji)
		} catch (err: any) {
			errorsFeed.addError("Unexpected error while updating the kanji")
			console.error(err)
			return
		}

		goto(resolve("/kanjis/view/[kanjiId]", { kanjiId: kanji.id }))
	}

	async function ondelete() {
		try {
			await deleteKanji(kanji.id)
		} catch (err: any) {
			errorsFeed.addError("Unexpected error while deleting the kanji")
			console.error(err)
			return
		}
		goto(resolve("/kanjis"))
	}

	function clearErrors() {
		errors = {}
	}
</script>

<svelte:head>
	<title>Edit kanji</title>
</svelte:head>

<KanjiPage>
	<!-- Kanji -->
	<KanjiFragment
		bind:value={kanji.kanji}
		error={errors.kanji}
	/>
	<!-- On'yomi -->
	<OnyomiReadingsFragment
		bind:value={kanji.onyomi}
		error={errors.onyomi}
	/>
	<!-- Kun'yomi -->
	<KunyomiReadingsFragment
		bind:value={kanji.kunyomi}
		error={errors.kunyomi}
	/>
	<!-- Nanori -->
	<NanoriReadingsFragment
		bind:value={kanji.nanori}
		error={errors.nanori}
	/>
	<!-- Meanings -->
	<MeaningsFragment
		bind:value={kanji.meanings}
		error={errors.meanings}
	/>
	<!-- JLPT level -->
	<JLPTLevelFragment
		bind:value={kanji.jlptLevel}
		error={errors.jlptLevel}
	/>
	<!-- Difficulty -->
	<DifficultyFragment
		bind:value={kanji.difficulty}
		error={errors.difficulty}
	/>
	<!-- Tags -->
	<TagsFragment
		bind:value={kanji.tags}
		error={errors.tags}
	/>
	<!-- Related words -->
	<RelatedWordsFragment
		bind:value={kanji.relatedWords}
		error={errors.relatedWords}
	/>
	<!-- Related kanjis -->
	<RelatedKanjisFragment
		bind:value={kanji.relatedKanjis}
		error={errors.relatedKanjis}
	/>
	<!-- Buttons -->
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
	{/snippet}
</KanjiPage>

<!-- Delete kanji modal -->
<Modal
	bind:open={showDeleteModal}
	title="Confirm deletion"
>
	<p>
		Do you really want to delete the kanji
		<span class="font-bold">
			{kanji.kanji} ({kanji.meanings[0].meaning})
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

<!-- Errors feed -->
<ErrorsFeed
	bind:this={errorsFeed}
	autoDismissTimeoutMs={5000}
/>
