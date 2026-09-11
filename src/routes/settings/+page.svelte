<script lang="ts">
	import Button from "flowbite-svelte/Button.svelte"
	import HomeIcon from "flowbite-svelte-icons/HomeSolid.svelte"
	import Labeled from "$lib/components/Labeled.svelte"
	import { resolve } from "$app/paths"
	import { db } from "$lib/database/database"
	import { exportDb, importDb, type SerializedDB } from "$lib/database/serialization"
	import { download } from "$lib/util"

	async function tryNukeDb() {
		if (!window.confirm("Do you really want to delete all database data?")) {
			return
		}
		await db.delete()
	}

	function tryNukeLocalStorage() {
		if (window.confirm("Do you really want to delete all local storage data?")) {
			return
		}
		localStorage.clear()
	}

	async function tryExportDb() {
		let filename = window.prompt("File name")
		if (!filename || filename.trim().length === 0) {
			return
		}
		filename = filename.trim()
		if (filename.endsWith(".json")) {
			filename = filename.slice(0, filename.length - ".json".length)
		}

		const serializedDb = await exportDb()
		const json = JSON.stringify(serializedDb, null, "    ")
		download(`${filename}.json`, json)
	}

	let dbImportFiles: FileList | null = $state(null)

	async function tryImportDb() {
		if (!dbImportFiles || dbImportFiles.length !== 1) {
			throw new Error()
		}
		const file = dbImportFiles[0]
		const json = await file.text()
		const data = JSON.parse(json) as SerializedDB
		await importDb(data)
		dbImportFiles = null
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
		<div class="flex flex-row flex-wrap gap-3">
			<!-- Import db -->
			<div class="">
				<!-- Import db file input -->
				<input
					type="file"
					bind:files={dbImportFiles}
					multiple={false}
					accept="application/json"
				/>
				<!-- Import db button -->
				<Button
					color="secondary"
					onclick={tryImportDb}
					class="mx-auto block"
					disabled={!dbImportFiles}
				>
					Import
				</Button>
			</div>
			<!-- Export db button -->
			<Button
				color="secondary"
				onclick={tryExportDb}
			>
				Export
			</Button>
			<!-- Nuke db button -->
			<Button
				color="red"
				onclick={tryNukeDb}
			>
				Nuke
			</Button>
		</div>
	</Labeled>
	<!-- Local storage -->
	<Labeled label="Local storage">
		<!-- Nuke local storage button -->
		<Button
			color="red"
			onclick={tryNukeLocalStorage}
		>
			Nuke
		</Button>
	</Labeled>
</main>
