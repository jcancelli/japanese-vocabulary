<script lang="ts">
	import type { WordDTO } from "$lib/dto.svelte"
	import {
		StudySessionLanguage,
		WordStudySessionStep,
		type WordStudySessionParams,
	} from "$lib/study_session"
	import { onMount } from "svelte"
	import AnswerPage from "./AnswerPage.svelte"
	import QuestionPage from "./QuestionPage.svelte"

	export interface SessionPageProps {
		step: WordStudySessionStep
		words: WordDTO[]
		params: WordStudySessionParams
	}

	let { step = $bindable(), words = $bindable(), params }: SessionPageProps = $props()

	let word: WordDTO = $derived(words[0])
	let language = $state(randomLanguage())
	let lastAnswer = $state("")

	function randomLanguage(): StudySessionLanguage {
		const languages: StudySessionLanguage[] = []
		params.language[StudySessionLanguage.JAP_TO_ENG]
			&& languages.push(StudySessionLanguage.JAP_TO_ENG)
		params.language[StudySessionLanguage.ENG_TO_JAP]
			&& languages.push(StudySessionLanguage.ENG_TO_JAP)

		if (languages.length === 0) {
			alert("No languages")
			return StudySessionLanguage.ENG_TO_JAP
		}

		const index = Math.round(Math.random() * (languages.length - 1))
		return languages[index]
	}

	function onanswer(answer: string, word: WordDTO, language: StudySessionLanguage) {
		lastAnswer = answer
		answer = answer.trim().toLowerCase()

		if (language === StudySessionLanguage.ENG_TO_JAP) {
			for (const { meaning } of word.meanings) {
				if (meaning.trim().toLowerCase() === answer) {
					step = WordStudySessionStep.ANSWER_RIGHT
					return
				}
			}
			step = WordStudySessionStep.ANSWER_WRONG
			return
		}

		if (language === StudySessionLanguage.JAP_TO_ENG) {
			if (
				(word.kanji !== undefined && word.kanji.toLowerCase() === answer)
				|| word.kana.toLowerCase() === answer
			) {
				step = WordStudySessionStep.ANSWER_RIGHT
				return
			}
			step = WordStudySessionStep.ANSWER_WRONG
			return
		}

		throw new Error("Invalid language")
	}

	function onnextword() {
		if (words.length === 1) {
			step = WordStudySessionStep.NO_MORE_WORDS
			words.splice(0, 1)
			return
		}
		step = WordStudySessionStep.QUESTION
		words.splice(0, 1)
		language = randomLanguage()
	}

	onMount(async () => {
		//let w = await getWord("84c91271-c24d-40dc-96e4-0a3064e11a30")
		//words = [w]
		//step = WordStudySessionStep.QUESTION
		//language = randomLanguage()
	})
</script>

<svelte:head>
	<title>Study session</title>
</svelte:head>

{#if step === WordStudySessionStep.QUESTION}
	<QuestionPage
		{word}
		{language}
		{onanswer}
	/>
{:else if step === WordStudySessionStep.ANSWER_RIGHT || step === WordStudySessionStep.ANSWER_WRONG}
	<AnswerPage
		{word}
		answer={lastAnswer}
		{language}
		isCorrect={step === WordStudySessionStep.ANSWER_RIGHT}
		{onnextword}
	/>
{:else}
	ERROR INVALID STEP
{/if}
