<script lang="ts">
	import { AdjectiveType } from "$lib/model"
	import { ADJECTIVE_TYPE_PRETTY_STRING } from "$lib/strings"
	import RadioGroup, { type Option } from "./RadioGroup.svelte"

	export interface AdjectiveTypeInputProps {
		value: AdjectiveType
		disabled?: boolean
		class?: string
	}

	let { value = $bindable(), disabled, ...props }: AdjectiveTypeInputProps = $props()

	function option(adjectiveType: AdjectiveType): Option<AdjectiveType> {
		return { label: ADJECTIVE_TYPE_PRETTY_STRING[adjectiveType], value: adjectiveType }
	}

	const options: Option<AdjectiveType>[] = [option(AdjectiveType.I), option(AdjectiveType.NA)]
</script>

<RadioGroup
	bind:value
	{options}
	{disabled}
	{...props}
/>
