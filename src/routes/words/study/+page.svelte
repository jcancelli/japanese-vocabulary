<script lang="ts">
	import { JLPTLevel, WordDifficulty } from "$lib/model"
	import {
		StudySessionLanguage,
		WordStudySessionStep,
		type WordStudySessionParams,
	} from "$lib/study_session"
	import type { WordDTO } from "$lib/dto.svelte"
	import { getStudySessionWords, getWord } from "$lib/database"
	import ConfigurePage from "./ConfigurePage.svelte"
	import QuestionPage from "./QuestionPage.svelte"
	import AnswerPage from "./AnswerPage.svelte"
	import { onMount } from "svelte"

	let params: WordStudySessionParams = $state({
		tags: {
			only: [],
			without: [],
		},
		jlptLevel: {
			[JLPTLevel.N5]: true,
			[JLPTLevel.N4]: false,
			[JLPTLevel.N3]: false,
			[JLPTLevel.N2]: false,
			[JLPTLevel.N1]: false,
		},
		difficulty: {
			[WordDifficulty.DONT_KNOW]: false,
			[WordDifficulty.KINDA_DONT_KNOW]: true,
			[WordDifficulty.KINDA_KNOW]: true,
			[WordDifficulty.KNOW]: true,
			[WordDifficulty.UNFORGETTABLE]: false,
		},
		language: {
			[StudySessionLanguage.ENG_TO_JAP]: true,
			[StudySessionLanguage.JAP_TO_ENG]: true,
		},
	})

	let step = $state(WordStudySessionStep.CONFIGURE)
	let words: WordDTO[] = $state([])
	let word: WordDTO | null = $derived(words[0] ?? null)
	let language = $state(randomLanguage())
	let lastAnswer = $state("")

	async function onsessionstart() {
		words = await getStudySessionWords(params)
		step = words.length > 0 ? WordStudySessionStep.QUESTION : WordStudySessionStep.NO_MORE_WORDS
		language = randomLanguage()
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
		words.splice(0, 1)
		step = words.length > 0 ? WordStudySessionStep.QUESTION : WordStudySessionStep.NO_MORE_WORDS
		language = randomLanguage()
	}

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

		const index = Math.round(Math.random() * languages.length) - 1
		return languages[index]
	}

	onMount(async () => {
		//let w = await getWord("84c91271-c24d-40dc-96e4-0a3064e11a30")
		//words = [w]
		//step = WordStudySessionStep.QUESTION
		//language = randomLanguage()
	})
</script>

<svelte:head>
	<title>Study words</title>
</svelte:head>

{#if step === WordStudySessionStep.CONFIGURE}
	<ConfigurePage
		bind:sessionParams={params}
		{onsessionstart}
	/>
{:else if step === WordStudySessionStep.QUESTION}
	<QuestionPage
		{word}
		{language}
		{onanswer}
	/>
{:else if step === WordStudySessionStep.ANSWER_RIGHT}
	<AnswerPage
		{word}
		answer={lastAnswer}
		{language}
		isCorrect={true}
		{onnextword}
	/>
{:else if step === WordStudySessionStep.ANSWER_WRONG}
	<AnswerPage
		{word}
		answer={lastAnswer}
		{language}
		isCorrect={false}
		{onnextword}
	/>
{:else if step === WordStudySessionStep.NO_MORE_WORDS}
	NO MORE WORDS
{:else}
	ERROR INVALID STEP
{/if}
