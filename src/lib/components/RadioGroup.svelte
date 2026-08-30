<script
	lang="ts"
	generics="T"
>
	import ButtonGroup from "./ButtonGroup.svelte"
	import ToggleButton from "./ToggleButton.svelte"

	export interface RadioGroupProps<T> {
		value: T
		options: Option<T>[]
		disabled?: boolean
		class?: string
	}

	export interface Option<T> {
		label: string
		value: T
	}

	let { value = $bindable(), options, disabled, ...props }: RadioGroupProps<T> = $props()
</script>

<ButtonGroup
	role="radiogroup"
	{...props}
>
	{#each options as { value: option, label }}
		<ToggleButton
			checked={value === option}
			onclick={() => (value = option)}
			role="radio"
			{disabled}
		>
			{label}
		</ToggleButton>
	{/each}
</ButtonGroup>
