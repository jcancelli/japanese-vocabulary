<script lang="ts">
	import type { Snippet } from "svelte"
	import Label from "flowbite-svelte/Label.svelte"

	export interface LabeledEntryProps {
		label?: string
		children?: Snippet
		class?: string
	}

	let { label, children, ...props }: LabeledEntryProps = $props()
</script>

<div {...props}>
	{#if label}
		<Label class="mb-2 text-lg font-bold">
			{label}
		</Label>
	{/if}
	{@render children?.()}
</div>
