<script lang="ts">
	import ExampleSentencesFragment from "$lib/components/forms/ExampleSentencesFragment.svelte"
	import JLPTLevelFragment from "$lib/components/forms/JLPTLevelFragment.svelte"
	import KanaFragment from "$lib/components/forms/KanaFragment.svelte"
	import KanjiFragment from "$lib/components/forms/KanjiFragment.svelte"
	import RelatedWordsFragment from "$lib/components/forms/RelatedWordsFragment.svelte"
	import TagsFragment from "$lib/components/forms/TagsFragment.svelte"
	import VerbTransitivityFragment from "$lib/components/forms/VerbTransitivityFragment.svelte"
	import VerbTypeFragment from "$lib/components/forms/VerbTypeFragment.svelte"
	import DifficultyFragment from "$lib/components/forms/DifficultyFragment.svelte"
	import WordMeaningsFragment from "$lib/components/forms/WordMeaningsFragment.svelte"
	import { VerbDTO } from "$lib/dto.svelte"
	import { VerbSchema } from "$lib/schema"
	import NewWordPage, { type Errors } from "../NewWordPage.svelte"

	let word = $state(new VerbDTO())
</script>

<NewWordPage
	{word}
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
		<WordMeaningsFragment
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
		<RelatedWordsFragment
			bind:value={word.relatedWords}
			wordId={word.id}
			error={errors.relatedWords}
		/>
	{/snippet}
</NewWordPage>
