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

<main class="h-screen w-screen overflow-auto">
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
</main>
