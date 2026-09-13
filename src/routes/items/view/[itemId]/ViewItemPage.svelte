<script lang="ts">
	import type { ItemDTO } from "$lib/dto.svelte"
	import type { Snippet } from "svelte"
	import ItemPage from "../../ItemPage.svelte"
	import { resolve } from "$app/paths"
	import Button from "flowbite-svelte/Button.svelte"
	import EditIcon from "flowbite-svelte-icons/PenSolid.svelte"

	export interface ViewItemPageProps {
		item: ItemDTO
		children: Snippet
	}

	let { item, children }: ViewItemPageProps = $props()
</script>

<ItemPage {item}>
	{@render children()}

	{#snippet buttons()}
		<Button
			color="secondary"
			href={resolve("/items/edit/[itemId]", { itemId: item.id })}
		>
			<EditIcon /> Edit
		</Button>
	{/snippet}
</ItemPage>
