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
	import {
		JLPT_LEVEL_PRETTY_STRING,
		STUDY_SESSION_LANGUAGE_PRETTY_STRING,
		WORD_DIFFICULTY_PRETTY_STRING,
	} from "$lib/strings"
	import {
		getWordStudySessionContext,
		StudySessionLanguage,
		WordStudySessionStep,
	} from "$lib/study_session"
	import { resolve } from "$app/paths"
	import { goto } from "$app/navigation"
	import ButtonGroup from "$lib/components/ButtonGroup.svelte"
	import ToggleButton from "$lib/components/ToggleButton.svelte"
	import ErrorsFeed from "$lib/components/ErrorsFeed.svelte"

	const session = getWordStudySessionContext()

	const allTags = liveQuery(getAllTags)

	let errorFeed: ErrorsFeed

	async function startSession() {
		if (
			!session.params.language[StudySessionLanguage.ENG_TO_JAP]
			&& !session.params.language[StudySessionLanguage.JAP_TO_ENG]
		) {
			errorFeed.addError("Please select a language")
			return
		}

		session.words = await getStudySessionWords(session.params)
		if (session.words.length === 0) {
			session.step = WordStudySessionStep.FINISHED
			await goto(resolve("/words/study/no-more-words"))
			return
		}
		session.step = WordStudySessionStep.STUDY
		await goto(resolve("/words/study/session"))
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
			<ToggleButton bind:checked={session.params.jlptLevel[level]}>
				{JLPT_LEVEL_PRETTY_STRING[level]}
			</ToggleButton>
		{/snippet}
		<Labeled label="JLPT Level">
			<ButtonGroup class="mx-auto">
				{@render jlptLevelCheckbox(JLPTLevel.N5)}
				{@render jlptLevelCheckbox(JLPTLevel.N4)}
				{@render jlptLevelCheckbox(JLPTLevel.N3)}
				{@render jlptLevelCheckbox(JLPTLevel.N2)}
				{@render jlptLevelCheckbox(JLPTLevel.N1)}
			</ButtonGroup>
		</Labeled>
		<!-- Language -->
		{#snippet languageCheckbox(language: StudySessionLanguage)}
			<ToggleButton bind:checked={session.params.language[language]}>
				{STUDY_SESSION_LANGUAGE_PRETTY_STRING[language]}
			</ToggleButton>
		{/snippet}
		<Labeled label="Language">
			<ButtonGroup class="mx-auto">
				{@render languageCheckbox(StudySessionLanguage.ENG_TO_JAP)}
				{@render languageCheckbox(StudySessionLanguage.JAP_TO_ENG)}
			</ButtonGroup>
		</Labeled>
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

<ErrorsFeed
	bind:this={errorFeed}
	autoDismissTimeoutMs={5000}
/>
