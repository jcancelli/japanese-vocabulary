<script lang="ts">
	import { goto } from "$app/navigation"
	import { resolve } from "$app/paths"
	import { getWordStudySessionContext, WordStudySessionStep } from "$lib/study_session"
	import { Button } from "flowbite-svelte"

	const session = getWordStudySessionContext()

	if (session.step !== WordStudySessionStep.FINISHED) {
		await goto(resolve("/words/study/configure"))
	}

	function newSession() {
		session.step = WordStudySessionStep.CONFIGURE
		goto(resolve("/words/study/configure"))
	}
</script>

<main class="flex h-screen w-screen flex-col items-center justify-center gap-7 overflow-auto">
	<h3 class="text-4xl font-semibold">No more words!</h3>
	<div class="flex flex-col items-center justify-center gap-1">
		<Button
			color="primary"
			onclick={newSession}
		>
			New session
		</Button>
		<p>or</p>
		<Button
			color="primary"
			href={resolve("/")}
		>
			Home
		</Button>
	</div>
</main>
