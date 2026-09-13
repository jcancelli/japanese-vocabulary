<script lang="ts">
	import { VerbTransitivityDTO } from "$lib/dto.svelte"
	import ButtonGroup from "../ButtonGroup.svelte"
	import ToggleButton from "../ToggleButton.svelte"

	export interface VerbTransitivityInputProps {
		value?: VerbTransitivityDTO | undefined
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), disabled, ...props }: VerbTransitivityInputProps = $props()

	if (value === undefined) {
		value = new VerbTransitivityDTO()
	}
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
