<script lang="ts">
	import { SimpleWordType } from "$lib/model"
	import { WORD_SUBTYPE_PRETTY_STRING } from "$lib/strings"
	import ButtonGroup from "../ButtonGroup.svelte"
	import ToggleButton from "../ToggleButton.svelte"

	export interface WordSubtypesInputProps {
		value: SimpleWordType[]
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), disabled, ...props }: WordSubtypesInputProps = $props()
</script>

{#snippet OptionCheckbox(subtype: SimpleWordType)}
	<ToggleButton
		bind:checked={
			() => value.includes(subtype),
			(isChecked) => {
				if (isChecked) {
					value.push(subtype)
				} else {
					value = value.filter((t) => t !== subtype)
				}
			}
		}
		role="checkbox"
		{disabled}
	>
		{WORD_SUBTYPE_PRETTY_STRING[subtype]}
	</ToggleButton>
{/snippet}

<ButtonGroup {...props}>
	{@render OptionCheckbox(SimpleWordType.NOUN)}
	{@render OptionCheckbox(SimpleWordType.ADVERB)}
	{@render OptionCheckbox(SimpleWordType.PRE_NOUN_ADJECTIVAL)}
</ButtonGroup>
