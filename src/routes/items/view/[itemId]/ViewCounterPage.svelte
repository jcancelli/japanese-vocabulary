<script lang="ts">
	import Button from "flowbite-svelte/Button.svelte"
	import { resolve } from "$app/paths"
	import EditIcon from "flowbite-svelte-icons/PenSolid.svelte"
	import Labeled from "$lib/components/Labeled.svelte"
	import { JLPT_LEVEL_COLOR } from "$lib/colors"
	import { JLPT_LEVEL_PRETTY_STRING } from "$lib/strings"
	import type { CounterDTO, KanjiDTO, WordDTO } from "$lib/dto.svelte"
	import ItemPage from "../../ItemPage.svelte"

	export interface ViewCounterPageProps {
		counter: CounterDTO
		relatedWords: WordDTO[]
		relatedKanjis: KanjiDTO[]
		relatedCounters: CounterDTO[]
	}

	let { counter, relatedWords, relatedKanjis, relatedCounters }: ViewCounterPageProps = $props()
	const { itemType, variants, meanings, jlptLevel, difficulty, tags } = $derived(counter)
	const NUMBER = {
		1: "一",
		2: "二",
		3: "三",
		4: "四",
		5: "五",
		6: "六",
		7: "七",
		8: "八",
		9: "九",
		10: "十",
		11: "十一",
	} as const
</script>

<ItemPage {itemType}>
	<!-- Counter -->
	<h2 class="mt-10 mb-7 text-center text-8xl font-bold">
		{counter.primaryWriting}
	</h2>
	<!-- Variants -->
	<Labeled label="Variants">
		<div class="grid grid-cols-3 text-center">
			{#each variants as { n, hiragana }}
				{#if hiragana}
					<p>{n}</p>
					<p>{NUMBER[n as keyof typeof NUMBER]}{counter.counter}</p>
					<p>{hiragana}</p>
				{/if}
			{/each}
		</div>
	</Labeled>
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
			href={resolve("/items/edit/[itemId]", { itemId: counter.id })}
		>
			<EditIcon /> Edit
		</Button>
	{/snippet}
</ItemPage>
