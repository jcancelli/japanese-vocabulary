<script lang="ts">
	import { beforeNavigate, goto } from "$app/navigation"
	import { resolve } from "$app/paths"
	import { getWordStudySessionContext, StudySessionStep } from "$lib/study_session"
	import { Button } from "flowbite-svelte"

	const session = getWordStudySessionContext()

	if (session.step !== StudySessionStep.FINISHED) {
		await goto(resolve("/words/study/configure"))
	}

	// Keep step value in sync
	beforeNavigate((navigation) => {
		if (!navigation.to) {
			return
		}
		switch (navigation.to.route.id) {
			case "/words/study/configure":
				session.step = StudySessionStep.CONFIGURE
				break
		}
	})
</script>

<main class="flex h-screen w-screen flex-col items-center justify-center gap-7 overflow-auto">
	<h3 class="text-4xl font-semibold">No more words!</h3>
	<div class="flex flex-col items-center justify-center gap-1">
		<Button
			color="primary"
			href={resolve("/words/study/configure")}
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
