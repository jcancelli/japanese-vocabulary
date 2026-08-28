<script lang="ts">
	import { resolve } from "$app/paths"
	import { JLPT_LEVEL_COLOR } from "$lib/colors"
	import Labeled from "$lib/components/Labeled.svelte"
	import { getAllRelatedWords } from "$lib/database"
	import { NounDTO } from "$lib/dto.svelte"
	import { JLPT_LEVEL_PRETTY_STRING, WORD_DIFFICULTY_PRETTY_STRING } from "$lib/strings"
	import ViewWordPage from "../ViewWordPage.svelte"

	export interface ViewNounPageProps {
		word: NounDTO
	}

	let { word }: ViewNounPageProps = $props()
</script>

<ViewWordPage {word}>
	<div class="grid grid-cols-2 gap-x-4 gap-y-6">
		<!-- Kanji -->
		<Labeled label="Kanji">
			<p>{word.kanji ?? "-"}</p>
		</Labeled>
		<!-- Kana -->
		<Labeled label="Kana">
			<p>{word.kana}</p>
		</Labeled>
		<!-- JLPT level -->
		<Labeled label="JLPT Level">
			<p style:color={JLPT_LEVEL_COLOR[word.jlptLevel]}>
				{JLPT_LEVEL_PRETTY_STRING[word.jlptLevel]}
			</p>
		</Labeled>
		<!-- Difficulty -->
		<Labeled label="Difficulty">
			<p>{WORD_DIFFICULTY_PRETTY_STRING[word.difficulty]}</p>
		</Labeled>
		<!-- Meanings -->
		<Labeled
			label="Meanings"
			class="col-span-2"
		>
			{#each word.meanings as entry}
				{@const { meaning, note } = entry}
				<p>{note ? `${meaning} (${note.toLowerCase()})` : meaning}</p>
			{/each}
		</Labeled>
		<!-- Example sentences -->
		<Labeled
			label="Example sentences"
			class="col-span-2"
		>
			{#each word.examples as example}
				<div class="py-1">
					<p>{example.japanese}</p>
					<p class="text-neutral-400">{example.english}</p>
				</div>
			{:else}
				<p class="text-center text-neutral-400">No example</p>
			{/each}
		</Labeled>
		<!-- Related words -->
		<Labeled
			label="Related words"
			class="col-span-2"
		>
			{#await getAllRelatedWords(word.id) then relatedWords}
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
					<p class="text-center text-neutral-400">No related word</p>
				{/each}
			{/await}
		</Labeled>
		<!-- Tags -->
		<Labeled
			label="Tags"
			class="col-span-2"
		>
			{#if word.tags.length > 0}
				<p>{word.tags.join(", ")}</p>
			{:else}
				<p class="text-center text-neutral-400">No tags</p>
			{/if}
		</Labeled>
	</div>
</ViewWordPage>
