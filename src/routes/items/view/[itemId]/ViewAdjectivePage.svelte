<script lang="ts">
	import type { AdjectiveDTO, CounterDTO, KanjiDTO, WordDTO } from "$lib/dto.svelte"
	import KanjiKanaFragment from "$lib/components/items/views/word/KanjiKanaFragment.svelte"
	import MeaningsFragment from "$lib/components/items/views/MeaningsFragment.svelte"
	import JLPTLevelFragment from "$lib/components/items/views/JLPTLevelFragment.svelte"
	import DifficultyFragment from "$lib/components/items/views/DifficultyFragment.svelte"
	import AdjectiveTypeFragment from "$lib/components/items/views/word/AdjectiveTypeFragment.svelte"
	import ExampleSentencesFragment from "$lib/components/items/views/ExampleSentencesFragment.svelte"
	import ViewItemPage from "./ViewItemPage.svelte"
	import RelatedItemsFragment from "$lib/components/items/views/RelatedItemsFragment.svelte"
	import TagsFragment from "$lib/components/items/views/TagsFragment.svelte"

	export interface ViewAdjectivePageProps {
		adjective: AdjectiveDTO
		relatedWords: WordDTO[]
		relatedKanjis: KanjiDTO[]
		relatedCounters: CounterDTO[]
	}

	let { adjective, relatedWords, relatedKanjis, relatedCounters }: ViewAdjectivePageProps =
		$props()
	const { kanji, kana, meanings, jlptLevel, difficulty, examples, tags, adjectiveType } =
		$derived(adjective)
</script>

<ViewItemPage item={adjective}>
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
	<!-- Adjective type -->
	<AdjectiveTypeFragment {adjectiveType} />
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
