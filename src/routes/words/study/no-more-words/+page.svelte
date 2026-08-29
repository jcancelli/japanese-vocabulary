<script lang="ts">
	import { resolve } from "$app/paths"
	import { Button } from "flowbite-svelte"
</script>

<main class="h-screen w-screen overflow-auto">
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
</main>
