<script lang="ts">
	import { WORD_DIFFICULTY_COLOR } from "$lib/colors"
	import { updateWord } from "$lib/database"
	import type { WordDTO } from "$lib/dto.svelte"
	import { WordDifficulty } from "$lib/model"
	import { StudySessionLanguage } from "$lib/study_session"

	export interface AnswerPageProps {
		word: WordDTO
		language: StudySessionLanguage
		answer: string
		onNextWord: () => void
	}

	let { word, language, answer, onNextWord }: AnswerPageProps = $props()

	const isCorrect = $derived.by(() => {
		if (language === StudySessionLanguage.ENG_TO_JAP) {
			for (const { meaning } of word.meanings) {
				if (meaning.trim().toLowerCase() === answer) {
					return true
				}
			}
			return false
		}

		if (language === StudySessionLanguage.JAP_TO_ENG) {
			if (
				(word.kanji !== undefined && word.kanji.toLowerCase() === answer)
				|| word.kana.toLowerCase() === answer
			) {
				return true
			}
			return false
		}

		throw new Error("Invalid language")
	})

	async function updateDifficulty(difficulty: WordDifficulty) {
		if (difficulty !== word.difficulty) {
			word.difficulty = difficulty
			await updateWord(word)
		}
		onNextWord()
	}
</script>

<svelte:head>
	<title>{isCorrect ? "Correct" : "Wrong"}</title>
</svelte:head>

<main class="grid h-screen w-screen grid-cols-1 grid-rows-[1fr_min-content]">
	<div
		class="
		flex flex-col items-center justify-center p-6 text-white
		{isCorrect ? 'bg-green-600' : 'bg-red-600'}
	"
	>
		{#if isCorrect}
			<h3 class="text-4xl font-bold">Correct</h3>
		{:else}
			<h3 class="text-4xl font-bold">Wrong</h3>
			<!-- Answer correction -->
			<div class="mt-5 flex flex-col items-center justify-center gap-4">
				<!-- The word -->
				<div class="flex flex-col items-center justify-center">
					<h4 class="font-semibold">Word</h4>
					<p>
						{#if language === StudySessionLanguage.ENG_TO_JAP}
							{word.primaryWriting}
						{:else if language === StudySessionLanguage.JAP_TO_ENG}
							{word.primaryMeaning}
						{:else}
							INVALID LANGUAGE
						{/if}
					</p>
				</div>
				<!-- You answer -->
				<div class="flex flex-col items-center justify-center">
					<h4 class="font-semibold">Your answer</h4>
					<p>{answer}</p>
				</div>
				<!-- Correct answers -->
				<div class="flex flex-col items-center justify-center">
					<h4 class="font-semibold">Correct answer</h4>
					{#if language === StudySessionLanguage.ENG_TO_JAP}
						{#each word.meanings as meaning}
							<p>{meaning.meaning}</p>
						{/each}
					{:else if language === StudySessionLanguage.JAP_TO_ENG}
						{#if word.kanji}
							<p>{word.kanji}</p>
							<p>or</p>
							<p>{word.kana}</p>
						{:else}
							<p>{word.kana}</p>
						{/if}
					{:else}
						INVALID LANGUAGE
					{/if}
				</div>
			</div>
		{/if}
	</div>
	<!-- Update difficulty -->
	<div class="relative grid grid-cols-5 drop-shadow">
		<p class="absolute -top-8 w-full text-center font-semibold text-white">Update difficulty</p>

		{#snippet difficultyButton(difficulty: WordDifficulty)}
			{@const isCurrentDifficulty = difficulty === word.difficulty}
			<button
				class="
					h-15 cursor-pointer border-black text-sm wrap-break-word
					text-black hover:scale-105 active:scale-105
				"
				style:background-color={WORD_DIFFICULTY_COLOR[difficulty]}
				class:border-3={isCurrentDifficulty}
				onclick={() => updateDifficulty(difficulty)}
			>
				{difficulty}
			</button>
		{/snippet}
		{@render difficultyButton(WordDifficulty.DONT_KNOW)}
		{@render difficultyButton(WordDifficulty.KINDA_DONT_KNOW)}
		{@render difficultyButton(WordDifficulty.KINDA_KNOW)}
		{@render difficultyButton(WordDifficulty.KNOW)}
		{@render difficultyButton(WordDifficulty.UNFORGETTABLE)}
	</div>
</main>
