<script lang="ts">
	import WordsIcon from "flowbite-svelte-icons/ListOutline.svelte"
	import StudyIcon from "flowbite-svelte-icons/BookOpenSolid.svelte"
	import SettingsIcon from "flowbite-svelte-icons/AdjustmentsHorizontalSolid.svelte"
	import SandboxIcon from "flowbite-svelte-icons/MicroscopeSolid.svelte"
	import NewItemWidget from "$lib/components/NewItemWidget.svelte"
	import { type Component } from "svelte"
	import { resolve } from "$app/paths"
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

{#snippet Card(href: string, title: string, IconComponent: Component)}
	<a
		{href}
		class="flex h-32 w-32 flex-col flex-nowrap items-center justify-between rounded-xl border-2 border-primary-700 p-2 shadow-lg"
	>
		<IconComponent class="mx-auto size-18"></IconComponent>
		<p class="text-center">{title}</p>
	</a>
{/snippet}

<main
	class="grid max-h-screen w-screen grid-cols-2 items-start justify-items-center gap-y-7 overflow-hidden p-5"
>
	{@render Card(resolve("/words"), "Words", WordsIcon)}
	{@render Card(resolve("/words/study"), "Study words", StudyIcon)}
	{@render Card(resolve("/settings"), "Settings", SettingsIcon)}
	{@render Card(resolve("/sandbox"), "Sandbox", SandboxIcon)}
</main>

<NewItemWidget class="absolute right-4 bottom-4" />
