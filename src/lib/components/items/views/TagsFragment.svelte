<script lang="ts">
	import Labeled from "$lib/components/Labeled.svelte"

	export interface TagsFragmentProps {
		tags: string[]
		class?: string | undefined
	}

	let { tags, ...props }: TagsFragmentProps = $props()
</script>

<Labeled
	label="Tags"
	class={props.class}
>
	{#if tags.length > 0}
		<p>{tags.join(", ")}</p>
	{:else}
		<p class="text-center text-neutral-400">No tags</p>
	{/if}
</Labeled>
