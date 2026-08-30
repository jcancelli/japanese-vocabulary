<script lang="ts">
	import type { Snippet } from "svelte"

	export interface ButtonGroupProps {
		children?: Snippet
		role?: "radiogroup"
		class?: string
	}

	let { children, role, ...props }: ButtonGroupProps = $props()
</script>

<div class="w-fit {props.class ?? ''}">
	<div
		class="
			flex w-fit flex-row items-center justify-center overflow-hidden rounded-xl border
			border-primary-600
		"
		{role}
	>
		{@render children?.()}
	</div>
</div>
