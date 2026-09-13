<script lang="ts">
	import type { CounterDTO, KanjiDTO, WordDTO } from "$lib/dto.svelte"
	import ViewItemPage from "./ViewItemPage.svelte"
	import MeaningsFragment from "$lib/components/items/views/MeaningsFragment.svelte"
	import JLPTLevelFragment from "$lib/components/items/views/JLPTLevelFragment.svelte"
	import DifficultyFragment from "$lib/components/items/views/DifficultyFragment.svelte"
	import ExampleSentencesFragment from "$lib/components/items/views/ExampleSentencesFragment.svelte"
	import RelatedItemsFragment from "$lib/components/items/views/RelatedItemsFragment.svelte"
	import TagsFragment from "$lib/components/items/views/TagsFragment.svelte"
	import CounterFragment from "$lib/components/items/views/counter/CounterFragment.svelte"
	import VariantsFragment from "$lib/components/items/views/counter/VariantsFragment.svelte"

	export interface ViewCounterPageProps {
		counter: CounterDTO
		relatedWords: WordDTO[]
		relatedKanjis: KanjiDTO[]
		relatedCounters: CounterDTO[]
	}

	let { counter, relatedWords, relatedKanjis, relatedCounters }: ViewCounterPageProps = $props()
	const { meanings, jlptLevel, difficulty, examples, tags } = $derived(counter)
</script>

<ViewItemPage item={counter}>
	<!-- Counter -->
	<CounterFragment
		primaryWriting={counter.primaryWriting}
		class="mt-10 mb-7"
	/>
	<!-- Variants -->
	<VariantsFragment {counter} />
	<!-- Meanings, JLPT level and difficulty -->
	<div class="grid w-full grid-cols-3">
		<MeaningsFragment {meanings} />
		<JLPTLevelFragment {jlptLevel} />
		<DifficultyFragment {difficulty} />
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
