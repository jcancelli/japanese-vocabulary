<script lang="ts">
	import type { CounterDTO, KanjiDTO, SimpleWordDTO, WordDTO } from "$lib/dto.svelte"
	import ViewItemPage from "./ViewItemPage.svelte"
	import KanjiKanaFragment from "$lib/components/items/views/word/KanjiKanaFragment.svelte"
	import MeaningsFragment from "$lib/components/items/views/MeaningsFragment.svelte"
	import JLPTLevelFragment from "$lib/components/items/views/JLPTLevelFragment.svelte"
	import DifficultyFragment from "$lib/components/items/views/DifficultyFragment.svelte"
	import ExampleSentencesFragment from "$lib/components/items/views/ExampleSentencesFragment.svelte"
	import RelatedItemsFragment from "$lib/components/items/views/RelatedItemsFragment.svelte"
	import TagsFragment from "$lib/components/items/views/TagsFragment.svelte"
	import WordSubtypesFragment from "$lib/components/items/views/word/WordSubtypesFragment.svelte"

	export interface ViewSimpleWordPageProps {
		simpleWord: SimpleWordDTO
		relatedWords: WordDTO[]
		relatedKanjis: KanjiDTO[]
		relatedCounters: CounterDTO[]
	}

	let { simpleWord, relatedWords, relatedKanjis, relatedCounters }: ViewSimpleWordPageProps =
		$props()
	const { kanji, kana, meanings, jlptLevel, difficulty, tags, examples, wordSubtypes } =
		$derived(simpleWord)
</script>

<ViewItemPage item={simpleWord}>
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
	<!-- Word subtypes -->
	<WordSubtypesFragment {wordSubtypes} />
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
