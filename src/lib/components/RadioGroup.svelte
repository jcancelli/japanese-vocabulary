<script
	lang="ts"
	generics="T"
>
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

{#snippet button(option: Option<T>)}
	{@const selected = option.value === value}
	<button
		class="
			border-primary-600
			px-3
			py-2
			not-last:border-r
			not-disabled:cursor-pointer
			hover:not-disabled:not-aria-checked:bg-primary-400
			disabled:saturate-50
		"
		class:bg-primary-600={selected}
		class:text-white={selected}
		onclick={() => (value = option.value)}
		role="radio"
		aria-checked={selected}
		{disabled}
	>
		{option.label}
	</button>
{/snippet}

<div class="w-fit {props.class ?? ''}">
	<div
		class="flex w-fit flex-row items-center justify-center overflow-hidden rounded-xl border border-primary-600"
		role="radiogroup"
	>
		{#each options as option}
			{@render button(option)}
		{/each}
	</div>
</div>
