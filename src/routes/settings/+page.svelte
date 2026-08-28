<script>
	import Button from "flowbite-svelte/Button.svelte"
	import HomeIcon from "flowbite-svelte-icons/HomeSolid.svelte"
	import Labeled from "$lib/components/Labeled.svelte"
	import { resolve } from "$app/paths"

	function exportDb() {}
</script>

<!-- Top bar -->
<div class="flex flex-row-reverse flex-nowrap gap-1 bg-neutral-50 p-2">
	<!-- Home button -->
	<a
		href={resolve("/")}
		class="flex size-12 items-center justify-center"
	>
		<HomeIcon
			size="xl"
			class="mx-auto"
		/>
	</a>
</div>

<main class="flex flex-col gap-6 p-6">
	<Labeled label="Database">
		<Button onclick={exportDb}>Export</Button>
	</Labeled>
</main>
