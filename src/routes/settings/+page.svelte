<script>
	import Button from "flowbite-svelte/Button.svelte"
	import HomeIcon from "flowbite-svelte-icons/HomeSolid.svelte"
	import Labeled from "$lib/components/Labeled.svelte"
	import { resolve } from "$app/paths"
	import Modal from "flowbite-svelte/Modal.svelte"
	import { db } from "$lib/database/database"

	let showNukeDbModal = $state(false)
	let showNukeLocalStorageModal = $state(false)

	async function nukeDb() {
		await db.delete()
		showNukeDbModal = false
	}

	function nukeLocalStorage() {
		localStorage.clear()
		showNukeLocalStorageModal = false
	}
</script>

<!-- Nav links -->
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
<!-- Content -->
<main class="flex flex-col gap-6 p-6">
	<!-- Database -->
	<Labeled label="Database">
		<!-- Nuke db button -->
		<Button
			color="red"
			onclick={() => (showNukeDbModal = true)}
		>
			Nuke
		</Button>
	</Labeled>
	<!-- Local storage -->
	<Labeled label="Local storage">
		<!-- Nuke local storage button -->
		<Button
			color="red"
			onclick={() => (showNukeLocalStorageModal = true)}
		>
			Nuke
		</Button>
	</Labeled>
</main>

<!-- Nuke database modal -->
<Modal
	title="Confirm database deletion"
	bind:open={showNukeDbModal}
>
	Are you sure you want to delete all the data stored in the database?
	{#snippet footer()}
		<Button
			color="red"
			onclick={nukeDb}
		>
			Yup
		</Button>
		<Button
			color="gray"
			onclick={() => (showNukeDbModal = false)}
		>
			Nope
		</Button>
	{/snippet}
</Modal>

<!-- Nuke local storage modal -->
<Modal
	title="Confirm local storage deletion"
	bind:open={showNukeLocalStorageModal}
>
	Are you sure you want to delete all data stored in local storage?
	{#snippet footer()}
		<Button
			color="red"
			onclick={nukeLocalStorage}
		>
			Yup
		</Button>
		<Button
			color="gray"
			onclick={() => (showNukeLocalStorageModal = false)}
		>
			Nope
		</Button>
	{/snippet}
</Modal>
