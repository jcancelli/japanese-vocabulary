<script lang="ts">
	import type { Snippet } from "svelte"

	export interface LabeledEntryProps {
		label?: string
		children?: Snippet
		class?: string
	}

	let { label, children, ...props }: LabeledEntryProps = $props()
</script>

<div {...props}>
	{#if label}
		<h4 class="font-semibold">
			{label}
		</h4>
	{/if}
	{@render children?.()}
</div>
