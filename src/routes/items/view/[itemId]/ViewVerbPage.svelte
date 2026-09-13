<script lang="ts">
	import { resolve } from "$app/paths"
	import { JLPT_LEVEL_COLOR } from "$lib/colors"
	import Labeled from "$lib/components/Labeled.svelte"
	import type { CounterDTO, KanjiDTO, VerbDTO, WordDTO } from "$lib/dto.svelte"
	import { JLPT_LEVEL_PRETTY_STRING, VERB_TYPE_PRETTY_STRING } from "$lib/strings"
	import ItemPage from "../../ItemPage.svelte"
	import Button from "flowbite-svelte/Button.svelte"
	import EditIcon from "flowbite-svelte-icons/PenSolid.svelte"

	export interface ViewVerbPageProps {
		verb: VerbDTO
		relatedWords: WordDTO[]
		relatedKanjis: KanjiDTO[]
		relatedCounters: CounterDTO[]
	}

	let { verb, relatedWords, relatedKanjis, relatedCounters }: ViewVerbPageProps = $props()
	const { kanji, kana, meanings, jlptLevel, difficulty, examples, tags, verbType, transitivity } =
		$derived(verb)
</script>

<ItemPage item={verb}>
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
	<!-- Verb type and transitivity -->
	<div class="grid grid-cols-2 text-center">
		<!-- Verb type -->
		<Labeled label="Verb type">
			{#if verbType !== undefined}
				<p>{VERB_TYPE_PRETTY_STRING[verbType]}</p>
			{:else}
				<p class="text-neutral-400">-</p>
			{/if}
		</Labeled>
		<!-- Transitivity -->
		<Labeled label="Transitivity">
			{#if transitivity}
				{#if transitivity.transitive && transitivity.intransitive}
					<p>Transitive & intransitive</p>
				{:else if transitivity.transitive}
					<p>Transitive</p>
				{:else if transitivity.intransitive}
					<p>Intransitive</p>
				{:else}
					INVALID TRANSITIVITY
				{/if}
			{:else}
				<p class="text-neutral-400">-</p>
			{/if}
		</Labeled>
	</div>
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
			href={resolve("/items/edit/[itemId]", { itemId: verb.id })}
		>
			<EditIcon /> Edit
		</Button>
	{/snippet}
</ItemPage>
