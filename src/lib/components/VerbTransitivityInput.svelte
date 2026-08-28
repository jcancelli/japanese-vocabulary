<script lang="ts">
	import type { VerbTransitivity } from "$lib/model"

	export interface VerbTransitivityInputProps {
		value: VerbTransitivity
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), disabled, ...props }: VerbTransitivityInputProps = $props()
</script>

<div class="w-fit {props.class ?? ''}">
	<div
		class="flex w-fit flex-row items-center justify-center overflow-hidden rounded-xl border border-primary-600"
	>
		<!-- Transitive -->
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
			class:bg-primary-600={value.transitive}
			class:text-white={value.transitive}
			onclick={() => (value.transitive = !value.transitive)}
			role="checkbox"
			aria-checked={value.transitive}
			{disabled}
		>
			Transitive
		</button>
		<!-- Intransitive -->
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
			class:bg-primary-600={value.intransitive}
			class:text-white={value.intransitive}
			onclick={() => (value.intransitive = !value.intransitive)}
			role="checkbox"
			aria-checked={value.intransitive}
			{disabled}
		>
			Intransitive
		</button>
	</div>
</div>
