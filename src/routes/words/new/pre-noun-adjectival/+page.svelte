<script lang="ts">
	import ExampleSentencesFragment from "$lib/components/forms/ExampleSentencesFragment.svelte"
	import JLPTLevelFragment from "$lib/components/forms/JLPTLevelFragment.svelte"
	import KanaFragment from "$lib/components/forms/KanaFragment.svelte"
	import KanjiFragment from "$lib/components/forms/KanjiFragment.svelte"
	import RelatedWordsFragment from "$lib/components/forms/RelatedWordsFragment.svelte"
	import TagsFragment from "$lib/components/forms/TagsFragment.svelte"
	import WordDifficultyFragment from "$lib/components/forms/WordDifficultyFragment.svelte"
	import WordMeaningsFragment from "$lib/components/forms/WordMeaningsFragment.svelte"
	import { PreNounAdjectivalDTO } from "$lib/dto.svelte"
	import { PreNounAdjectivalSchema } from "$lib/schema"
	import NewWordPage, { type Errors } from "../NewWordPage.svelte"

	let word = $state(new PreNounAdjectivalDTO())
</script>

<NewWordPage
	{word}
	Schema={PreNounAdjectivalSchema}
>
	{#snippet children(word: PreNounAdjectivalDTO, errors: Errors<PreNounAdjectivalDTO>)}
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
		<!-- JLPT Level -->
		<JLPTLevelFragment
			bind:value={word.jlptLevel}
			error={errors.jlptLevel}
		/>
		<!-- Difficulty -->
		<WordDifficultyFragment
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
	{/snippet}
</NewWordPage>
