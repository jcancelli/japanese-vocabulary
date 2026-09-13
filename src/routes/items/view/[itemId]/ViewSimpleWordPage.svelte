<script lang="ts">
	import { resolve } from "$app/paths"
	import { JLPT_LEVEL_COLOR } from "$lib/colors"
	import Labeled from "$lib/components/Labeled.svelte"
	import type { CounterDTO, KanjiDTO, SimpleWordDTO, WordDTO } from "$lib/dto.svelte"
	import { JLPT_LEVEL_PRETTY_STRING, WORD_SUBTYPE_PRETTY_STRING } from "$lib/strings"
	import ItemPage from "../../ItemPage.svelte"
	import Button from "flowbite-svelte/Button.svelte"
	import EditIcon from "flowbite-svelte-icons/PenSolid.svelte"

	export interface ViewSimpleWordPageProps {
		simpleWord: SimpleWordDTO
		relatedWords: WordDTO[]
		relatedKanjis: KanjiDTO[]
		relatedCounters: CounterDTO[]
	}

	let { simpleWord, relatedWords, relatedKanjis, relatedCounters }: ViewSimpleWordPageProps =
		$props()
	const {
		itemType,
		wordType,
		kanji,
		kana,
		meanings,
		jlptLevel,
		difficulty,
		tags,
		examples,
		wordSubtypes,
	} = $derived(simpleWord)
</script>

<ItemPage
	{itemType}
	{wordType}
>
	<!-- Kanji/kana -->
	<div class="mt-10 mb-4 text-center">
		{#if kanji}
			<h2 class="text-5xl font-bold">
				{kanji}
			</h2>
			<h3 class="text-md mt-2 font-semibold">
				{kana}
			</h3>
		{:else}
			<h2 class="text-5xl font-bold">
				{kana}
			</h2>
		{/if}
	</div>
	<div class="grid w-full grid-cols-3">
		<!-- Meanings -->
		<Labeled
			label="Meanings"
			class="text-center"
		>
			{#if meanings.length > 0}
				<p>
					{meanings
						.map(({ meaning, note }) => (note ? `${meaning} (${note})` : meaning))
						.join(", ")}
				</p>
			{:else}
				<p class="text-neutral-400">-</p>
			{/if}
		</Labeled>
		<!-- JLPT level -->
		<Labeled
			label="JLPT Level"
			class="text-center"
		>
			{#if jlptLevel}
				<p style:color={JLPT_LEVEL_COLOR[jlptLevel]}>
					{JLPT_LEVEL_PRETTY_STRING[jlptLevel]}
				</p>
			{:else}
				<p class="text-neutral-400">-</p>
			{/if}
		</Labeled>
		<!-- Difficulty -->
		<Labeled
			label="Difficulty"
			class="text-center"
		>
			<p>{difficulty}/5</p>
		</Labeled>
	</div>
	<!-- Word subtypes -->
	<Labeled
		label="Word types"
		class="text-center"
	>
		{#if wordSubtypes.length > 0}
			<p>{wordSubtypes.map((t) => WORD_SUBTYPE_PRETTY_STRING[t]).join(", ")}</p>
		{:else}
			<p class="text-neutral-400">-</p>
		{/if}
	</Labeled>
	<!-- Examples -->
	<Labeled label="Examples">
		<div class="grid grid-cols-2">
			{#each examples as { english, japanese }}
				<p>{japanese}</p>
				<p>{english}</p>
			{:else}
				<p class="col-span-2 text-center text-neutral-400">No examples</p>
			{/each}
		</div>
	</Labeled>
	<!-- Related words -->
	<Labeled label="Related words">
		{#each relatedWords as relatedWord}
			<a
				href={resolve("/items/view/[itemId]", { itemId: relatedWord.id })}
				class="block cursor-pointer py-1 hover:underline"
			>
				{relatedWord.primaryWriting}
				({relatedWord.primaryMeaning.meaning.toLowerCase()})
			</a>
		{:else}
			<p class="text-center text-neutral-400">No related words</p>
		{/each}
	</Labeled>
	<!-- Related kanjis -->
	<Labeled label="Related kanjis">
		{#each relatedKanjis as relatedKanji}
			<a
				href={resolve("/items/view/[itemId]", { itemId: relatedKanji.id })}
				class="block cursor-pointer py-1 hover:underline"
			>
				{relatedKanji.kanji}
				({relatedKanji.primaryMeaning.meaning.toLowerCase()})
			</a>
		{:else}
			<p class="text-center text-neutral-400">No related kanjis</p>
		{/each}
	</Labeled>
	<!-- Related counters -->
	<Labeled label="Related counters">
		{#each relatedCounters as relatedCounter}
			<a
				href={resolve("/items/view/[itemId]", { itemId: relatedCounter.id })}
				class="block cursor-pointer py-1 hover:underline"
			>
				{relatedCounter.primaryWriting}
				({relatedCounter.primaryMeaning.meaning.toLowerCase()})
			</a>
		{:else}
			<p class="text-center text-neutral-400">No related counters</p>
		{/each}
	</Labeled>
	<!-- Tags -->
	<Labeled label="Tags">
		{#if tags.length > 0}
			<p>{tags.join(", ")}</p>
		{:else}
			<p class="text-center text-neutral-400">No tags</p>
		{/if}
	</Labeled>
	<!-- Buttons -->
	{#snippet buttons()}
		<Button
			color="secondary"
			href={resolve("/items/edit/[itemId]", { itemId: simpleWord.id })}
		>
			<EditIcon /> Edit
		</Button>
	{/snippet}
</ItemPage>
