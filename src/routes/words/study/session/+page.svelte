<script lang="ts">
	import {
		getWordStudySessionContext,
		StudySessionLanguage,
		WordStudySessionStep,
	} from "$lib/study_session"
	import AnswerPage from "./AnswerPage.svelte"
	import QuestionPage from "./QuestionPage.svelte"
	import HomeIcon from "flowbite-svelte-icons/HomeOutline.svelte"
	import ConfigureIcon from "flowbite-svelte-icons/CogOutline.svelte"
	import { beforeNavigate, goto } from "$app/navigation"
	import { resolve } from "$app/paths"

	const session = getWordStudySessionContext()

	if (session.step !== WordStudySessionStep.STUDY) {
		await goto(resolve("/words/study/configure"))
	}

	// Keep step value in sync
	beforeNavigate((navigation) => {
		if (!navigation.to) {
			return
		}
		switch (navigation.to.route.id) {
			case "/words/study/configure":
				session.step = WordStudySessionStep.CONFIGURE
				break
			case "/words/study/no-more-words":
				session.step = WordStudySessionStep.FINISHED
				break
		}
	})

	let word = $derived(session.words[0])
	let language = $state(randomLanguage())
	let answer = $state("")
	let hasAnswered = $state(false)

	function randomLanguage(): StudySessionLanguage {
		const languages: StudySessionLanguage[] = []
		session.params.language[StudySessionLanguage.JAP_TO_ENG]
			&& languages.push(StudySessionLanguage.JAP_TO_ENG)
		session.params.language[StudySessionLanguage.ENG_TO_JAP]
			&& languages.push(StudySessionLanguage.ENG_TO_JAP)

		if (languages.length === 0) {
			alert("No languages")
			return StudySessionLanguage.ENG_TO_JAP
		}

		const index = Math.round(Math.random() * (languages.length - 1))
		return languages[index]
	}

	function onCommitAnswer() {
		hasAnswered = true
	}

	function onNextWord() {
		if (session.words.length === 1) {
			session.words.splice(0, 1)
			goto(resolve("/words/study/no-more-words"))
			return
		}
		answer = ""
		hasAnswered = false
		session.words.splice(0, 1)
		language = randomLanguage()
	}
</script>

<div class="fixed top-4 right-4 flex flex-row gap-2">
	<a href={resolve("/words/study/configure")}>
		<ConfigureIcon class="size-8" />
	</a>
	<a href={resolve("/")}><HomeIcon class="size-8" /></a>
</div>

{#if !hasAnswered}
	<QuestionPage
		bind:answer
		{word}
		{language}
		{onCommitAnswer}
	/>
{:else}
	<AnswerPage
		{word}
		{answer}
		{language}
		{onNextWord}
	/>
{/if}
