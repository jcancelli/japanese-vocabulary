<script lang="ts">
	import { JLPTLevel, WordDifficulty } from "$lib/model"
	import {
		StudySessionLanguage,
		WordStudySessionStep,
		type WordStudySessionParams,
	} from "$lib/study_session"
	import type { WordDTO } from "$lib/dto.svelte"
	import { getStudySessionWords } from "$lib/database"
	import ConfigurePage from "./ConfigurePage.svelte"
	import SessionPage from "./SessionPage.svelte"

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

	async function onsessionstart() {
		words = await getStudySessionWords(params)
		step = words.length > 0 ? WordStudySessionStep.QUESTION : WordStudySessionStep.NO_MORE_WORDS
	}
</script>

{#if step === WordStudySessionStep.CONFIGURE}
	<ConfigurePage
		bind:sessionParams={params}
		{onsessionstart}
	/>
{:else if step === WordStudySessionStep.QUESTION || step === WordStudySessionStep.ANSWER_RIGHT || step === WordStudySessionStep.ANSWER_WRONG}
	<SessionPage
		bind:step
		bind:words
		{params}
	/>
{:else if step === WordStudySessionStep.NO_MORE_WORDS}
	NO MORE WORDS
{:else}
	ERROR INVALID STEP
{/if}
