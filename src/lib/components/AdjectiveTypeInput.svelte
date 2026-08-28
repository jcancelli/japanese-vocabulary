<script lang="ts">
	import { AdjectiveType } from "$lib/model"
	import { ADJECTIVE_TYPE_PRETTY_STRING } from "$lib/strings"

	export interface AdjectiveTypeInputProps {
		value: AdjectiveType
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), disabled, ...props }: AdjectiveTypeInputProps = $props()
</script>

{#snippet button(adjectiveType: AdjectiveType)}
	{@const selected = value === adjectiveType}
	<button
		class="
			border-primary-600
			px-2
			py-2
			not-last:border-r
			not-disabled:cursor-pointer
			hover:not-disabled:not-aria-checked:bg-primary-400
			disabled:saturate-50
		"
		class:bg-primary-600={selected}
		class:text-white={selected}
		onclick={() => (value = adjectiveType)}
		role="radio"
		aria-checked={selected}
		{disabled}
	>
		{ADJECTIVE_TYPE_PRETTY_STRING[adjectiveType]}
	</button>
{/snippet}

<div class="w-fit {props.class ?? ''}">
	<div
		class="flex w-fit flex-row items-center justify-center overflow-hidden rounded-xl border border-primary-600"
		role="radiogroup"
	>
		{@render button(AdjectiveType.I)}
		{@render button(AdjectiveType.NA)}
	</div>
</div>
