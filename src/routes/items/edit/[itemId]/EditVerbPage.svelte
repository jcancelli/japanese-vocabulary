<script lang="ts">
	import DifficultyFragment from "$lib/components/items/forms/DifficultyFragment.svelte"
	import ExampleSentencesFragment from "$lib/components/items/forms/ExampleSentencesFragment.svelte"
	import JLPTLevelFragment from "$lib/components/items/forms/JLPTLevelFragment.svelte"
	import MeaningsFragment from "$lib/components/items/forms/MeaningsFragment.svelte"
	import RelatedItemsFragment from "$lib/components/items/forms/RelatedItemsFragment.svelte"
	import TagsFragment from "$lib/components/items/forms/TagsFragment.svelte"
	import KanaFragment from "$lib/components/items/forms/word/KanaFragment.svelte"
	import KanjiFragment from "$lib/components/items/forms/word/KanjiFragment.svelte"
	import VerbTransitivityFragment from "$lib/components/items/forms/word/VerbTransitivityFragment.svelte"
	import VerbTypeFragment from "$lib/components/items/forms/word/VerbTypeFragment.svelte"
	import type { VerbDTO } from "$lib/dto.svelte"
	import { ItemType } from "$lib/model"
	import { VerbSchema } from "$lib/schema"
	import EditItemPage, { type Errors } from "../EditItemPage.svelte"

	export interface EditVerbPageProps {
		verb: VerbDTO
	}

	let { verb }: EditVerbPageProps = $props()
</script>

<EditItemPage
	item={verb}
	Schema={VerbSchema}
>
	{#snippet children(word: VerbDTO, errors: Errors<VerbDTO>)}
		<!-- Kanji -->
		<KanjiFragment
			bind:value={word.kanji}
			error={errors.kanji}
		/>
		<!-- Kana -->
		<KanaFragment
			bind:value={word.kana}
			error={errors.kana}
		/>
		<!-- Meanings -->
		<MeaningsFragment
			bind:value={word.meanings}
			error={errors.meanings}
		/>
		<!-- Verb type -->
		<VerbTypeFragment
			bind:value={word.verbType}
			error={errors.verbType}
		/>
		<!-- Transitivity -->
		<VerbTransitivityFragment
			bind:value={word.transitivity}
			error={errors.transitivity}
		/>
		<!-- JLPT Level -->
		<JLPTLevelFragment
			bind:value={word.jlptLevel}
			error={errors.jlptLevel}
		/>
		<!-- Difficulty -->
		<DifficultyFragment
			bind:value={word.difficulty}
			error={errors.difficulty}
		/>
		<!-- Example sentences -->
		<ExampleSentencesFragment
			bind:value={word.examples}
			error={errors.examples}
		/>
		<!-- Tags -->
		<TagsFragment
			bind:value={word.tags}
			error={errors.tags}
		/>
		<!-- Related words -->
		<RelatedItemsFragment
			bind:value={word.relatedWords}
			error={errors.relatedWords}
			itemId={word.id}
			relatedType={ItemType.WORD}
			label="Related words"
		/>
		<!-- Related kanjis -->
		<RelatedItemsFragment
			bind:value={word.relatedKanjis}
			error={errors.relatedKanjis}
			itemId={word.id}
			relatedType={ItemType.KANJI}
			label="Related kanjis"
		/>
		<!-- Related counters -->
		<RelatedItemsFragment
			bind:value={word.relatedCounters}
			error={errors.relatedCounters}
			itemId={word.id}
			relatedType={ItemType.COUNTER}
			label="Related counters"
		/>
	{/snippet}
</EditItemPage>
