<script lang="ts">
	import Labeled from "$lib/components/Labeled.svelte"
	import Button from "flowbite-svelte/Button.svelte"
	import Checkbox from "flowbite-svelte/Checkbox.svelte"
	import Tags from "flowbite-svelte/Tags.svelte"
	import StartIcon from "flowbite-svelte-icons/StarSolid.svelte"
	import BackIcon from "flowbite-svelte-icons/ChevronLeftOutline.svelte"
	import { liveQuery } from "dexie"
	import { getAllTags, getStudySessionWords } from "$lib/database"
	import { JLPTLevel, WordDifficulty } from "$lib/model"
	import { JLPT_LEVEL_PRETTY_STRING, WORD_DIFFICULTY_PRETTY_STRING } from "$lib/strings"
	import { getWordStudySessionContext } from "$lib/study_session"
	import { resolve } from "$app/paths"
	import { goto } from "$app/navigation"

	const session = getWordStudySessionContext()

	const allTags = liveQuery(getAllTags)

	async function startSession() {
		session.words = await getStudySessionWords(session.params)
		if (session.words.length === 0) {
			goto(resolve("/words/study/no-more-words"))
			return
		}
		goto(resolve("/words/study/session"))
	}
</script>

<svelte:head>
	<title>Configure study session</title>
</svelte:head>

<main class="grid h-screen w-screen grid-cols-1 grid-rows-[1fr_min-content]">
	<!-- Form -->
	<div class="flex flex-col gap-6 overflow-auto p-6">
		<!-- Only tags -->
		<Labeled label="Only tags">
			<Tags
				bind:value={session.params.tags.only}
				availableTags={$allTags ?? []}
				allowNewTags={false}
				unique
				showHelper
			/>
		</Labeled>
		<!-- Without tags -->
		<Labeled label="Without tags">
			<Tags
				bind:value={session.params.tags.without}
				availableTags={$allTags ?? []}
				allowNewTags={false}
				unique
				showHelper
			/>
		</Labeled>
		<!-- Difficulty -->
		{#snippet difficultyCheckbox(difficulty: WordDifficulty)}
			<Checkbox bind:checked={session.params.difficulty[difficulty]}>
				{WORD_DIFFICULTY_PRETTY_STRING[difficulty]}
			</Checkbox>
		{/snippet}
		<Labeled label="Difficulty">
			<div class="mx-auto flex w-fit flex-col items-start justify-center gap-2">
				{@render difficultyCheckbox(WordDifficulty.DONT_KNOW)}
				{@render difficultyCheckbox(WordDifficulty.KINDA_DONT_KNOW)}
				{@render difficultyCheckbox(WordDifficulty.KINDA_KNOW)}
				{@render difficultyCheckbox(WordDifficulty.KNOW)}
				{@render difficultyCheckbox(WordDifficulty.UNFORGETTABLE)}
			</div>
		</Labeled>
		<!-- JLPT level -->
		{#snippet jlptLevelCheckbox(level: JLPTLevel)}
			<Checkbox bind:checked={session.params.jlptLevel[level]}>
				{JLPT_LEVEL_PRETTY_STRING[level]}
			</Checkbox>
		{/snippet}
		<Labeled label="JLPT Level">
			<div class="mx-auto flex w-fit flex-row items-start justify-center gap-2">
				{@render jlptLevelCheckbox(JLPTLevel.N5)}
				{@render jlptLevelCheckbox(JLPTLevel.N4)}
				{@render jlptLevelCheckbox(JLPTLevel.N3)}
				{@render jlptLevelCheckbox(JLPTLevel.N2)}
				{@render jlptLevelCheckbox(JLPTLevel.N1)}
			</div>
		</Labeled>
		<!-- TODO: Language -->
	</div>
	<!-- Buttons -->
	<div class="flex flex-col flex-nowrap gap-2 px-1 py-3">
		<Button
			color="primary"
			onclick={startSession}
		>
			<StartIcon /> Start
		</Button>
		<Button
			color="gray"
			href={resolve("/")}
		>
			<BackIcon /> Home
		</Button>
	</div>
</main>
