<script lang="ts">
	import Button from "flowbite-svelte/Button.svelte"
	import KanjiPage from "../../KanjiPage.svelte"
	import { resolve } from "$app/paths"
	import type { PageProps } from "./$types"
	import EditIcon from "flowbite-svelte-icons/PenSolid.svelte"
	import Labeled from "$lib/components/Labeled.svelte"
	import { JLPT_LEVEL_COLOR } from "$lib/colors"
	import { DIFFICULTY_PRETTY_STRING, JLPT_LEVEL_PRETTY_STRING } from "$lib/strings"

	let { data }: PageProps = $props()

	const kanji = $derived(data.kanji)
	const relatedWords = $derived(data.relatedWords)
	const relatedKanjis = $derived(data.relatedKanjis)
</script>

<KanjiPage>
	<!-- Kanji -->
	<h2 class="mt-14 mb-7 text-center text-7xl font-bold">
		{kanji.kanji}
	</h2>
	<!-- All the other attributes -->
	<div class="grid grid-cols-2 gap-x-4 gap-y-6">
		<!-- On'yomis -->
		<Labeled
			label="On'yomi"
			class="wrap-break-word"
		>
			<p>
				{#if kanji.onyomi.length > 0}
					{kanji.onyomi.join(", ")}
				{:else}
					-
				{/if}
			</p>
		</Labeled>
		<!-- Kun'yomis -->
		<Labeled label="Kun'yomi">
			<p>
				{#if kanji.kunyomi.length > 0}
					{kanji.kunyomi.join(", ")}
				{:else}
					-
				{/if}
			</p>
		</Labeled>
		<!-- Nanori -->
		<Labeled label="Nanori">
			<p>
				{#if kanji.nanori.length > 0}
					{kanji.nanori.join(", ")}
				{:else}
					-
				{/if}
			</p>
		</Labeled>
		<!-- Meanings -->
		<Labeled
			label="Meanings"
			class="col-span-2"
		>
			{#each kanji.meanings as entry}
				{@const { meaning, note } = entry}
				<p>{note ? `${meaning} (${note.toLowerCase()})` : meaning}</p>
			{/each}
		</Labeled>
		<!-- JLPT level -->
		<Labeled label="JLPT Level">
			<p style:color={JLPT_LEVEL_COLOR[kanji.jlptLevel]}>
				{JLPT_LEVEL_PRETTY_STRING[kanji.jlptLevel]}
			</p>
		</Labeled>
		<!-- Difficulty -->
		<Labeled label="Difficulty">
			<p>{DIFFICULTY_PRETTY_STRING[kanji.difficulty]}</p>
		</Labeled>
		<!-- Related words -->
		<Labeled
			label="Related words"
			class="col-span-2"
		>
			{#each relatedWords as relatedWord}
				<a
					href={resolve("/words/view/[wordId]", { wordId: relatedWord.id })}
					class="block cursor-pointer py-1 hover:underline"
				>
					{relatedWord.primaryWriting}
					{#if relatedWord.primaryMeaning}
						({relatedWord.primaryMeaning.toLowerCase()})
					{/if}
				</a>
			{:else}
				<p class="text-center text-neutral-400">No related words</p>
			{/each}
		</Labeled>
		<!-- Related kanjis -->
		<Labeled
			label="Related kanjis"
			class="col-span-2"
		>
			{#each relatedKanjis as relatedKanji}
				<a
					href={resolve("/kanjis/view/[kanjiId]", { kanjiId: relatedKanji.id })}
					class="block cursor-pointer py-1 hover:underline"
				>
					{relatedKanji.primaryWriting}
					{#if relatedKanji.primaryMeaning}
						({relatedKanji.primaryMeaning.toLowerCase()})
					{/if}
				</a>
			{:else}
				<p class="text-center text-neutral-400">No related kanjis</p>
			{/each}
		</Labeled>
		<!-- Tags -->
		<Labeled
			label="Tags"
			class="col-span-2"
		>
			{#if kanji.tags.length > 0}
				<p>{kanji.tags.join(", ")}</p>
			{:else}
				<p class="text-center text-neutral-400">No tags</p>
			{/if}
		</Labeled>
	</div>
	<!-- Buttons -->
	{#snippet buttons()}
		<Button
			color="secondary"
			href={resolve("/kanjis/edit/[kanjiId]", { kanjiId: kanji.id })}
		>
			<EditIcon /> Edit
		</Button>
	{/snippet}
</KanjiPage>
