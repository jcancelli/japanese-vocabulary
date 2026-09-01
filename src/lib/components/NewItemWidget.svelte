<script lang="ts">
	import SpeedDialTrigger from "flowbite-svelte/SpeedDialTrigger.svelte"
	import SpeedDial from "flowbite-svelte/SpeedDial.svelte"
	import Listgroup from "flowbite-svelte/Listgroup.svelte"
	import ListgroupItem from "flowbite-svelte/ListgroupItem.svelte"
	import { resolve } from "$app/paths"

	let props: { class?: string } = $props()
</script>

<SpeedDialTrigger {...props} />
<SpeedDial tooltip="none">
	<Listgroup active>
		<ListgroupItem href={resolve("/words/new/noun")}>Noun</ListgroupItem>
		<ListgroupItem href={resolve("/words/new/verb")}>Verb</ListgroupItem>
		<ListgroupItem href={resolve("/words/new/adverb")}>Adverb</ListgroupItem>
		<ListgroupItem href={resolve("/words/new/adjective")}>Adjective</ListgroupItem>
		<ListgroupItem href={resolve("/words/new/pre-noun-adjectival")}>
			Pre-Noun Adjectival
		</ListgroupItem>
		<ListgroupItem href={resolve("/kanjis/new")}>Kanji</ListgroupItem>
	</Listgroup>
</SpeedDial>
