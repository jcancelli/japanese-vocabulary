<script lang="ts">
	import { JLPTLevel } from "$lib/model"
	import { JLPT_LEVEL_PRETTY_STRING } from "$lib/strings"
	import RadioGroup, { type Option } from "./RadioGroup.svelte"

	export interface JLPTLevelInputProps {
		value: JLPTLevel
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), disabled, ...props }: JLPTLevelInputProps = $props()

	function option(level: JLPTLevel): Option<JLPTLevel> {
		return { label: JLPT_LEVEL_PRETTY_STRING[level], value: level }
	}

	const options = [
		option(JLPTLevel.N5),
		option(JLPTLevel.N4),
		option(JLPTLevel.N3),
		option(JLPTLevel.N2),
		option(JLPTLevel.N1),
	]
</script>

<RadioGroup
	bind:value
	{options}
	{disabled}
	{...props}
/>
