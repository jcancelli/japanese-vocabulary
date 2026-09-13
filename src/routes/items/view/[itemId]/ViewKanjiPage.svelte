<script lang="ts">
	import type { CounterDTO, KanjiDTO, WordDTO } from "$lib/dto.svelte"
	import KanjiFragment from "$lib/components/items/views/kanji/KanjiFragment.svelte"
	import ReadingsFragment from "$lib/components/items/views/kanji/ReadingsFragment.svelte"
	import MeaningsFragment from "$lib/components/items/views/MeaningsFragment.svelte"
	import JLPTLevelFragment from "$lib/components/items/views/JLPTLevelFragment.svelte"
	import DifficultyFragment from "$lib/components/items/views/DifficultyFragment.svelte"
	import RelatedItemsFragment from "$lib/components/items/views/RelatedItemsFragment.svelte"
	import TagsFragment from "$lib/components/items/views/TagsFragment.svelte"
	import ViewItemPage from "./ViewItemPage.svelte"

	export interface KanjiPageProps {
		kanji: KanjiDTO
		relatedWords: WordDTO[]
		relatedKanjis: KanjiDTO[]
		relatedCounters: CounterDTO[]
	}

	let { kanji, relatedWords, relatedKanjis, relatedCounters }: KanjiPageProps = $props()
	const { onyomi, kunyomi, nanori, meanings, jlptLevel, difficulty, tags } = $derived(kanji)
</script>

<ViewItemPage item={kanji}>
	<!-- Kanji -->
	<KanjiFragment
		kanji={kanji.kanji}
		class="mt-10 mb-7"
	/>
	<!-- Readings -->
	<div class="grid grid-cols-3 text-center">
		<ReadingsFragment
			label="On'yomi"
			pronounciations={onyomi}
		/>
		<ReadingsFragment
			label="Kun'yomi"
			pronounciations={kunyomi}
		/>
		<ReadingsFragment
			label="Nanori"
			pronounciations={nanori}
		/>
	</div>
	<!-- Meanings, JLPT level and difficulty -->
	<div class="grid grid-cols-3">
		<MeaningsFragment {meanings} />
		<JLPTLevelFragment {jlptLevel} />
		<DifficultyFragment {difficulty} />
	</div>
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
