<script lang="ts">
	import DifficultyFragment from "$lib/components/items/forms/DifficultyFragment.svelte"
	import JLPTLevelFragment from "$lib/components/items/forms/JLPTLevelFragment.svelte"
	import KanjiFragment from "$lib/components/items/forms/kanji/KanjiFragment.svelte"
	import ReadingsFragment from "$lib/components/items/forms/kanji/ReadingsFragment.svelte"
	import MeaningsFragment from "$lib/components/items/forms/MeaningsFragment.svelte"
	import RelatedItemsFragment from "$lib/components/items/forms/RelatedItemsFragment.svelte"
	import TagsFragment from "$lib/components/items/forms/TagsFragment.svelte"
	import type { KanjiDTO } from "$lib/dto.svelte"
	import { ItemType } from "$lib/model"
	import { KanjiSchema } from "$lib/schema"
	import EditItemPage, { type Errors } from "../EditItemPage.svelte"

	export interface KanjiPageProps {
		kanji: KanjiDTO
	}

	let { kanji }: KanjiPageProps = $props()
</script>

<EditItemPage
	item={kanji}
	Schema={KanjiSchema}
>
	{#snippet children(kanji: KanjiDTO, errors: Errors<KanjiDTO>)}
		<!-- Kanji -->
		<KanjiFragment
			bind:value={kanji.kanji}
			error={errors.kanji}
		/>
		<!-- On'yomi -->
		<ReadingsFragment
			label="On'yomi"
			bind:value={kanji.onyomi}
			error={errors.onyomi}
		/>
		<!-- Kun'yomi -->
		<ReadingsFragment
			label="Kun'yomi"
			bind:value={kanji.kunyomi}
			error={errors.kunyomi}
		/>
		<!-- Nanori -->
		<ReadingsFragment
			label="Nanori"
			bind:value={kanji.nanori}
			error={errors.nanori}
		/>
		<!-- Meanings -->
		<MeaningsFragment
			bind:value={kanji.meanings}
			error={errors.meanings}
		/>
		<!-- JLPT Level -->
		<JLPTLevelFragment
			bind:value={kanji.jlptLevel}
			error={errors.jlptLevel}
		/>
		<!-- Difficulty -->
		<DifficultyFragment
			bind:value={kanji.difficulty}
			error={errors.difficulty}
		/>
		<!-- Tags -->
		<TagsFragment
			bind:value={kanji.tags}
			error={errors.tags}
		/>
		<!-- Related words -->
		<RelatedItemsFragment
			bind:value={kanji.relatedWords}
			error={errors.relatedWords}
			itemId={kanji.id}
			relatedType={ItemType.WORD}
			label="Related words"
		/>
		<!-- Related kanjis -->
		<RelatedItemsFragment
			bind:value={kanji.relatedKanjis}
			error={errors.relatedKanjis}
			itemId={kanji.id}
			relatedType={ItemType.KANJI}
			label="Related kanjis"
		/>
		<!-- Related counters -->
		<RelatedItemsFragment
			bind:value={kanji.relatedCounters}
			error={errors.relatedCounters}
			itemId={kanji.id}
			relatedType={ItemType.COUNTER}
			label="Related counters"
		/>
	{/snippet}
</EditItemPage>
