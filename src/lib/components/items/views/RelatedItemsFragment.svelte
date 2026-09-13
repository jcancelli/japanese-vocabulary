<script lang="ts">
	import { resolve } from "$app/paths"
	import Labeled from "$lib/components/Labeled.svelte"
	import type { ItemDTO } from "$lib/dto.svelte"

	export interface RelatedItemsFragmentProps {
		label: string
		noEntryPlaceholder: string
		relatedItems: ItemDTO[]
		class?: string | undefined
	}

	let { label, noEntryPlaceholder, relatedItems, ...props }: RelatedItemsFragmentProps = $props()
</script>

<Labeled
	{label}
	class={props.class}
>
	{#each relatedItems as relatedItem}
		{@const { id, primaryWriting, primaryMeaning } = relatedItem}
		<a
			href={resolve("/items/view/[itemId]", { itemId: id })}
			class="block cursor-pointer py-1 hover:underline"
		>
			{primaryWriting}
			({primaryMeaning.meaning.toLowerCase()})
		</a>
	{:else}
		<p class="text-center text-neutral-400">{noEntryPlaceholder}</p>
	{/each}
</Labeled>
