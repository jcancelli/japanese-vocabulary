<script lang="ts">
	import Labeled from "$lib/components/Labeled.svelte"
	import Button from "flowbite-svelte/Button.svelte"
	import Checkbox from "flowbite-svelte/Checkbox.svelte"
	import Tags from "flowbite-svelte/Tags.svelte"
	import HomeIcon from "flowbite-svelte-icons/HomeOutline.svelte"
	import { JLPTLevel, Difficulty } from "$lib/model"
	import {
		JLPT_LEVEL_PRETTY_STRING,
		STUDY_SESSION_LANGUAGE_PRETTY_STRING,
		DIFFICULTY_PRETTY_STRING,
	} from "$lib/strings"
	import {
		getKanjiStudySessionContext,
		StudySessionLanguage,
		KanjiStudySessionSortingField,
		StudySessionStep,
	} from "$lib/study_session"
	import { resolve } from "$app/paths"
	import { beforeNavigate, goto } from "$app/navigation"
	import ButtonGroup from "$lib/components/ButtonGroup.svelte"
	import ToggleButton from "$lib/components/ToggleButton.svelte"
	import ErrorsFeed from "$lib/components/ErrorsFeed.svelte"
	import RadioGroup from "$lib/components/RadioGroup.svelte"
	import Label from "flowbite-svelte/Label.svelte"
	import { getStudySessionKanjis } from "$lib/database/study_sessions"
	import { getAllKanjiTags } from "$lib/database/kanjis"

	const session = getKanjiStudySessionContext()

	const allTags = await getAllKanjiTags()

	let errorFeed: ErrorsFeed

	// Keep step value in sync
	beforeNavigate((navigation) => {
		if (!navigation.to) {
			return
		}
		switch (navigation.to.route.id) {
			case "/kanjis/study/session":
				session.step = StudySessionStep.STUDY
				break
			case "/kanjis/study/finish":
				session.step = StudySessionStep.FINISHED
				break
		}
	})

	async function startSession() {
		if (
			!session.params.language[StudySessionLanguage.ENG_TO_JAP]
			&& !session.params.language[StudySessionLanguage.JAP_TO_ENG]
		) {
			errorFeed.addError("Please select one or more languages")
			return
		}

		session.kanjis = await getStudySessionKanjis(session.params)
		if (session.kanjis.length === 0) {
			await goto(resolve("/kanjis/study/finish"))
			return
		}
		await goto(resolve("/kanjis/study/session"))
	}
</script>

<svelte:head>
	<title>Configure study session</title>
</svelte:head>

<!-- Nav -->
<div class="fixed top-4 right-4 flex flex-row gap-2">
	<a href={resolve("/")}><HomeIcon class="size-8" /></a>
</div>

<main class="grid h-screen w-screen grid-cols-1 grid-rows-[1fr_min-content]">
	<!-- Form, mt-4 gives a little spacing from the nav -->
	<div class="mt-4 flex flex-col gap-6 overflow-auto p-6">
		<!-- Only tags -->
		<Labeled label="Only tags">
			<Tags
				bind:value={session.params.tags.only}
				availableTags={allTags ?? []}
				allowNewTags={false}
				unique
				showHelper
			/>
		</Labeled>
		<!-- Without tags -->
		<Labeled label="Without tags">
			<Tags
				bind:value={session.params.tags.without}
				availableTags={allTags ?? []}
				allowNewTags={false}
				unique
				showHelper
			/>
		</Labeled>
		<!-- Difficulty -->
		{#snippet difficultyCheckbox(difficulty: Difficulty)}
			<Checkbox bind:checked={session.params.difficulty[difficulty]}>
				{DIFFICULTY_PRETTY_STRING[difficulty]}
			</Checkbox>
		{/snippet}
		<Labeled label="Difficulty">
			<div class="mx-auto flex w-fit flex-col items-start justify-center gap-2">
				{@render difficultyCheckbox(Difficulty.DONT_KNOW)}
				{@render difficultyCheckbox(Difficulty.KINDA_DONT_KNOW)}
				{@render difficultyCheckbox(Difficulty.KINDA_KNOW)}
				{@render difficultyCheckbox(Difficulty.KNOW)}
				{@render difficultyCheckbox(Difficulty.UNFORGETTABLE)}
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
		<!-- Sorting -->
		<Labeled label="Sort kanjis">
			<!-- Sort field -->
			<Label class="mx-auto w-fit">
				<p class="font-semibold">Field</p>
				<RadioGroup
					bind:value={session.params.sort.by}
					options={[
						{
							label: "Difficulty",
							value: KanjiStudySessionSortingField.DIFFICULTY,
						},
						{
							label: "Last time studied",
							value: KanjiStudySessionSortingField.LAST_STUDIED,
						},
					]}
					class="mx-auto mt-1"
				/>
			</Label>
			<!-- Sort order -->
			<Label class="mx-auto mt-3 w-fit">
				<p class="font-semibold">Order</p>
				<RadioGroup
					bind:value={session.params.sort.order}
					options={[
						{
							label: "Ascending",
							value: "ascending",
						},
						{
							label: "Descending",
							value: "descending",
						},
					]}
					class="mx-auto mt-1"
				/>
			</Label>
		</Labeled>
	</div>
	<!-- Buttons -->
	<div class="flex flex-col flex-nowrap gap-2 px-1 py-3">
		<Button
			color="primary"
			onclick={startSession}
		>
			Start session
		</Button>
	</div>
</main>
<!-- Errors feed -->
<ErrorsFeed
	bind:this={errorFeed}
	autoDismissTimeoutMs={5000}
/>
