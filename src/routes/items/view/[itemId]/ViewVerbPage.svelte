<script lang="ts">
	import type { CounterDTO, KanjiDTO, VerbDTO, WordDTO } from "$lib/dto.svelte"
	import ViewItemPage from "./ViewItemPage.svelte"
	import KanjiKanaFragment from "$lib/components/items/views/word/KanjiKanaFragment.svelte"
	import MeaningsFragment from "$lib/components/items/views/MeaningsFragment.svelte"
	import JLPTLevelFragment from "$lib/components/items/views/JLPTLevelFragment.svelte"
	import DifficultyFragment from "$lib/components/items/views/DifficultyFragment.svelte"
	import ExampleSentencesFragment from "$lib/components/items/views/ExampleSentencesFragment.svelte"
	import RelatedItemsFragment from "$lib/components/items/views/RelatedItemsFragment.svelte"
	import TagsFragment from "$lib/components/items/views/TagsFragment.svelte"
	import VerbTypeFragment from "$lib/components/items/views/word/VerbTypeFragment.svelte"
	import VerbTransitivityFragment from "$lib/components/items/views/word/VerbTransitivityFragment.svelte"

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

<ViewItemPage item={verb}>
	<!-- Kanji/kana -->
	<KanjiKanaFragment
		{kanji}
		{kana}
		class="mt-10 mb-4"
	/>
	<!-- Meanings, JLPT level and difficulty -->
	<div class="grid w-full grid-cols-3">
		<MeaningsFragment {meanings} />
		<JLPTLevelFragment {jlptLevel} />
		<DifficultyFragment {difficulty} />
	</div>
	<!-- Verb type and transitivity -->
	<div class="grid grid-cols-2 text-center">
		<!-- Verb type -->
		<VerbTypeFragment {verbType} />
		<!-- Transitivity -->
		<VerbTransitivityFragment {transitivity} />
	</div>
	<!-- Examples -->
	<ExampleSentencesFragment {examples} />
	<!-- Related words -->
	<RelatedItemsFragment
		relatedItems={relatedWords}
		label="Related words"
		noEntryPlaceholder="No related words"
	/>
	<!-- Related kanjis -->
	<RelatedItemsFragment
		relatedItems={relatedKanjis}
		label="Related kanjis"
		noEntryPlaceholder="No related kanjis"
	/>
	<!-- Related counters -->
	<RelatedItemsFragment
		relatedItems={relatedCounters}
		label="Related counters"
		noEntryPlaceholder="No related counters"
	/>
	<!-- Tags -->
	<TagsFragment {tags} />
</ViewItemPage>
