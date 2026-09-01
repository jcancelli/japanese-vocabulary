<script lang="ts">
	import AdjectiveTypeFragment from "$lib/components/forms/AdjectiveTypeFragment.svelte"
	import ExampleSentencesFragment from "$lib/components/forms/ExampleSentencesFragment.svelte"
	import JLPTLevelFragment from "$lib/components/forms/JLPTLevelFragment.svelte"
	import KanaFragment from "$lib/components/forms/KanaFragment.svelte"
	import KanjiFragment from "$lib/components/forms/KanjiFragment.svelte"
	import RelatedWordsFragment from "$lib/components/forms/RelatedWordsFragment.svelte"
	import TagsFragment from "$lib/components/forms/TagsFragment.svelte"
	import DifficultyFragment from "$lib/components/forms/DifficultyFragment.svelte"
	import WordMeaningsFragment from "$lib/components/forms/WordMeaningsFragment.svelte"
	import type { AdjectiveDTO } from "$lib/dto.svelte"
	import { AdjectiveSchema } from "$lib/schema"
	import EditWordPage, { type Errors } from "../EditWordPage.svelte"
	import RelatedKanjisFragment from "$lib/components/forms/RelatedKanjisFragment.svelte"

	export interface EditAdjectivePageProps {
		word: AdjectiveDTO
	}

	let { word }: EditAdjectivePageProps = $props()
</script>

<EditWordPage
	{word}
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
		<WordMeaningsFragment
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
		<RelatedWordsFragment
			bind:value={word.relatedWords}
			wordId={word.id}
			error={errors.relatedWords}
		/>
		<!-- Related kanjis -->
		<RelatedKanjisFragment
			bind:value={word.relatedWords}
			error={errors.relatedWords}
		/>
	{/snippet}
</EditWordPage>
