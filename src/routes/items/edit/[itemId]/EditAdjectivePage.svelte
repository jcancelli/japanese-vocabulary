<script lang="ts">
	import type { AdjectiveDTO } from "$lib/dto.svelte"
	import EditItemPage, { type Errors } from "../EditItemPage.svelte"
	import { AdjectiveSchema } from "$lib/schema"
	import KanjiFragment from "$lib/components/items/forms/word/KanjiFragment.svelte"
	import KanaFragment from "$lib/components/items/forms/word/KanaFragment.svelte"
	import MeaningsFragment from "$lib/components/items/forms/MeaningsFragment.svelte"
	import AdjectiveTypeFragment from "$lib/components/items/forms/word/AdjectiveTypeFragment.svelte"
	import JLPTLevelFragment from "$lib/components/items/forms/JLPTLevelFragment.svelte"
	import DifficultyFragment from "$lib/components/items/forms/DifficultyFragment.svelte"
	import ExampleSentencesFragment from "$lib/components/items/forms/ExampleSentencesFragment.svelte"
	import TagsFragment from "$lib/components/items/forms/TagsFragment.svelte"
	import RelatedItemsFragment from "$lib/components/items/forms/RelatedItemsFragment.svelte"
	import { ItemType } from "$lib/model"

	export interface EditAdjectivePageProps {
		adjective: AdjectiveDTO
	}

	let { adjective }: EditAdjectivePageProps = $props()
</script>

<EditItemPage
	item={adjective}
	Schema={AdjectiveSchema}
>
	{#snippet children(word: AdjectiveDTO, errors: Errors<AdjectiveDTO>)}
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
		<!-- Adjective type -->
		<AdjectiveTypeFragment
			bind:value={word.adjectiveType}
			error={errors.adjectiveType}
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
