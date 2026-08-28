<script lang="ts">
	import type { WordDTO } from "$lib/dto.svelte"
	import { StudySessionLanguage } from "$lib/study_session"
	import Input from "flowbite-svelte/Input.svelte"
	import Button from "flowbite-svelte/Button.svelte"

	export interface QuestionPageProps {
		word: WordDTO
		language: StudySessionLanguage
		onanswer: (answer: string, word: WordDTO, language: StudySessionLanguage) => void
	}

	let { word, language, onanswer }: QuestionPageProps = $props()

	let answer = $state("")
</script>

<main class="flex h-screen w-screen flex-col items-center justify-center p-6">
	<!-- Question -->
	<h2 class="text-3xl font-bold">
		{#if language === StudySessionLanguage.JAP_TO_ENG}
			{word.primaryMeaning}
		{:else}
			{word.primaryWriting}
		{/if}
	</h2>
	<!-- Answer input -->
	<div class="mt-6 w-10/12">
		<Input
			bind:value={answer}
			type="text"
			placeholder="Answer"
		/>
	</div>
	<!-- Submit answer button -->
	<div class="mt-6">
		<Button
			color="primary"
			onclick={() => onanswer(answer.trim(), word, language)}
		>
			Sumbit
		</Button>
	</div>
</main>
