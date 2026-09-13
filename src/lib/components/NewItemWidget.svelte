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
		<ListgroupItem href={resolve("/items/create/simple-word")}>Simple word</ListgroupItem>
		<ListgroupItem href={resolve("/items/create/verb")}>Verb</ListgroupItem>
		<ListgroupItem href={resolve("/items/create/adjective")}>Adjective</ListgroupItem>
		<ListgroupItem href={resolve("/items/create/kanji")}>Kanji</ListgroupItem>
		<ListgroupItem href={resolve("/items/create/counter")}>Counter</ListgroupItem>
	</Listgroup>
</SpeedDial>
