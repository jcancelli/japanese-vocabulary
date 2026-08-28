<script lang="ts">
	import { VerbType } from "$lib/model"
	import { VERB_TYPE_PRETTY_STRING } from "$lib/strings"
	import RadioGroup, { type Option } from "./RadioGroup.svelte"

	export interface VerbTypeInputProps {
		value: VerbType
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), disabled, ...props }: VerbTypeInputProps = $props()

	function option(verbType: VerbType): Option<VerbType> {
		return { label: VERB_TYPE_PRETTY_STRING[verbType], value: verbType }
	}

	const options = [
		option(VerbType.GODAN),
		option(VerbType.ICHIDAN),
		option(VerbType.SURU),
		option(VerbType.KURU),
	]
</script>

<RadioGroup
	bind:value
	{options}
	{disabled}
	{...props}
/>
