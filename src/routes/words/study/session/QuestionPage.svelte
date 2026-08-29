<script lang="ts">
	import type { WordDTO } from "$lib/dto.svelte"
	import { StudySessionLanguage } from "$lib/study_session"
	import Input from "flowbite-svelte/Input.svelte"
	import Button from "flowbite-svelte/Button.svelte"

	export interface QuestionPageProps {
		answer: string
		word: WordDTO
		language: StudySessionLanguage
		onCommitAnswer: () => void
	}

	let { answer = $bindable(), word, language, onCommitAnswer }: QuestionPageProps = $props()

	const question = $derived(
		language === StudySessionLanguage.JAP_TO_ENG ? word.primaryMeaning : word.primaryWriting,
	)
</script>

<svelte:head>
	<title>{question}</title>
</svelte:head>

<main class="flex h-screen w-screen flex-col items-center justify-center p-6">
	<!-- Question -->
	<h2 class="text-3xl font-bold">
		{question}
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
			onclick={onCommitAnswer}
		>
			Sumbit
		</Button>
	</div>
</main>
