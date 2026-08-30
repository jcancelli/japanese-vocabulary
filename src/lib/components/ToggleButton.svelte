<script lang="ts">
	import type { Snippet } from "svelte"

	export interface ToggleButtonProps {
		children: Snippet
		checked: boolean
		onclick?: () => void
		role?: "checkbox" | "radio"
		disabled?: boolean
		class?: string
	}

	let {
		children,
		checked = $bindable(),
		onclick = () => {
			checked = !checked
		},
		role = "checkbox",
		disabled,
		...props
	}: ToggleButtonProps = $props()
</script>

<button
	class="
		border-primary-600
		px-3
		py-2
		not-last:border-r
		not-disabled:cursor-pointer
		hover:not-disabled:not-aria-checked:bg-primary-400
		disabled:saturate-50
		{props.class ?? ''}
	"
	class:bg-primary-600={checked}
	class:text-white={checked}
	aria-checked={checked}
	{role}
	{onclick}
	{disabled}
>
	{@render children()}
</button>
