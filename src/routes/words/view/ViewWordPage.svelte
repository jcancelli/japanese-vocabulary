<script lang="ts">
	import { WORD_TYPE_PRETTY_STRING } from "$lib/strings"
	import Button from "flowbite-svelte/Button.svelte"
	import EditIcon from "flowbite-svelte-icons/PenSolid.svelte"
	import BackIcon from "flowbite-svelte-icons/AngleLeftOutline.svelte"
	import type { Snippet } from "svelte"
	import WordPage from "../WordPage.svelte"
	import type { WordDTO } from "$lib/dto.svelte"

	export interface ViewWordPageProps {
		word: WordDTO
		children: Snippet
	}

	let { word, children }: ViewWordPageProps = $props()
</script>

<svelte:head>
	<title>View {WORD_TYPE_PRETTY_STRING[word.wordType]}</title>
</svelte:head>

<WordPage {word}>
	{@render children()}

	{#snippet buttons()}
		<Button
			color="secondary"
			href="/words/edit/{word.id}"
		>
			<EditIcon /> Edit
		</Button>
		<Button
			color="gray"
			href="/words"
		>
			<BackIcon /> Back
		</Button>
	{/snippet}
</WordPage>
