<script lang="ts">
	import type { VerbTransitivity } from "$lib/model"
	import ButtonGroup from "./ButtonGroup.svelte"
	import ToggleButton from "./ToggleButton.svelte"

	export interface VerbTransitivityInputProps {
		value: VerbTransitivity
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), disabled, ...props }: VerbTransitivityInputProps = $props()
</script>

<ButtonGroup {...props}>
	<ToggleButton
		bind:checked={value.transitive}
		role="checkbox"
		{disabled}
	>
		Transitive
	</ToggleButton>
	<ToggleButton
		bind:checked={value.intransitive}
		role="checkbox"
		{disabled}
	>
		Intransitive
	</ToggleButton>
</ButtonGroup>
