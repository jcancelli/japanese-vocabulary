<script lang="ts">
	import SpeedDialTrigger from "flowbite-svelte/SpeedDialTrigger.svelte"
	import SpeedDial from "flowbite-svelte/SpeedDial.svelte"
	import Listgroup from "flowbite-svelte/Listgroup.svelte"
	import ListgroupItem from "flowbite-svelte/ListgroupItem.svelte"

	let props: { class?: string } = $props()
</script>

<SpeedDialTrigger {...props} />
<SpeedDial tooltip="none">
	<Listgroup active>
		<ListgroupItem href="/words/new/noun">Noun</ListgroupItem>
		<ListgroupItem href="/words/new/verb">Verb</ListgroupItem>
		<ListgroupItem href="/words/new/adverb">Adverb</ListgroupItem>
		<ListgroupItem href="/words/new/adjective">Adjective</ListgroupItem>
		<ListgroupItem href="/words/new/pre-noun-adjectival">Pre-Noun Adjectival</ListgroupItem>
	</Listgroup>
</SpeedDial>
