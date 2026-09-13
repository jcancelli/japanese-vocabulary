<script
	lang="ts"
	generics="T"
>
	import ButtonGroup from "./ButtonGroup.svelte"
	import ToggleButton from "./ToggleButton.svelte"

	export interface RadioGroupProps<T> {
		value?: T | undefined
		options: Option<T>[]
		disabled?: boolean
		class?: string
	}

	export interface Option<T> {
		label: string
		value: T
	}

	let { value = $bindable(), options, disabled, ...props }: RadioGroupProps<T> = $props()

	function toggle(option: T) {
		value = value === option ? undefined : option
	}
</script>

<ButtonGroup
	role="radiogroup"
	{...props}
>
	{#each options as { value: option, label }}
		<ToggleButton
			checked={value === option}
			onclick={() => toggle(option)}
			role="radio"
			{disabled}
		>
			{label}
		</ToggleButton>
	{/each}
</ButtonGroup>
