<script lang="ts">
	import type { Snippet } from "svelte"

	export interface KanjiPageProps {
		children: Snippet
		buttons: Snippet
	}

	let { children, buttons }: KanjiPageProps = $props()
</script>

<div class="grid h-screen w-screen grid-cols-1 grid-rows-[1fr_min-content] overflow-auto">
	<main class="flex flex-col gap-6 overflow-auto p-6">
		{@render children()}
	</main>

	{#if buttons}
		<div class="flex flex-col flex-nowrap gap-2 px-1 py-3">
			{@render buttons()}
		</div>
	{/if}
</div>
