<script lang="ts">
	import { resolve } from "$app/paths"
	import type { Snippet } from "svelte"
	import HomeIcon from "flowbite-svelte-icons/HomeSolid.svelte"
	import KanjiListIcon from "flowbite-svelte-icons/AlignCenterOutline.svelte"
	import Tooltip from "flowbite-svelte/Tooltip.svelte"

	export interface KanjiPageProps {
		children: Snippet
		buttons: Snippet
	}

	let { children, buttons }: KanjiPageProps = $props()
</script>

<!-- Nav links -->
<div class="fixed top-0 right-0 z-10 flex flex-row items-center justify-center gap-2 p-4">
	<!-- Kanjis -->
	<a href={resolve("/kanjis")}>
		<KanjiListIcon size="xl" />
	</a>
	<Tooltip>Kanjis list</Tooltip>
	<!-- Home -->
	<a href={resolve("/")}>
		<HomeIcon size="xl" />
	</a>
	<Tooltip>Home</Tooltip>
</div>
<!-- Page -->
<div class="grid h-screen w-screen grid-cols-1 grid-rows-[1fr_min-content] overflow-auto">
	<!-- Main content -->
	<main class="flex flex-col gap-6 overflow-auto p-6">
		{@render children()}
	</main>
	<!-- Buttons -->
	{#if buttons}
		<div class="flex flex-col flex-nowrap gap-2 px-1 py-3">
			{@render buttons()}
		</div>
	{/if}
</div>
