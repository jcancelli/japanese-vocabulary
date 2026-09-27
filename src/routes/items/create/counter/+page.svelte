<script lang="ts">
	import { CounterDTO } from "$lib/dto.svelte"
	import CreateItemPage, { type Errors } from "../CreateItemPage.svelte"
	import { CounterSchema } from "$lib/schema"
	import MeaningsFragment from "$lib/components/items/forms/MeaningsFragment.svelte"
	import JLPTLevelFragment from "$lib/components/items/forms/JLPTLevelFragment.svelte"
	import DifficultyFragment from "$lib/components/items/forms/DifficultyFragment.svelte"
	import TagsFragment from "$lib/components/items/forms/TagsFragment.svelte"
	import { ItemType } from "$lib/model"
	import RelatedItemsFragment from "$lib/components/items/forms/RelatedItemsFragment.svelte"
	import CounterFragment from "$lib/components/items/forms/counter/CounterFragment.svelte"
	import VariantsFragment from "$lib/components/items/forms/counter/VariantsFragment.svelte"

	let counter = $state(new CounterDTO())
</script>

<CreateItemPage
	item={counter}
	Schema={CounterSchema}
>
	{#snippet children(counter: CounterDTO, errors: Errors<CounterDTO>)}
		<!-- Counter -->
		<CounterFragment
			bind:value={counter.counter}
			error={errors.counter}
		/>
		<!-- Variants -->
		<VariantsFragment
			bind:value={counter.variants}
			error={errors.variants}
		/>
		<!-- Meanings -->
		<MeaningsFragment
			bind:value={counter.meanings}
			error={errors.meanings}
		/>
		<!-- JLPT Level -->
		<JLPTLevelFragment
			bind:value={counter.jlptLevel}
			error={errors.jlptLevel}
		/>
		<!-- Difficulty -->
		<DifficultyFragment
			bind:value={counter.difficulty}
			error={errors.difficulty}
		/>
		<!-- Tags -->
		<TagsFragment
			bind:value={counter.tags}
			error={errors.tags}
		/>
		<!-- Related words -->
		<RelatedItemsFragment
			bind:value={counter.relatedWords}
			error={errors.relatedWords}
			itemId={counter.id}
			relatedType={ItemType.WORD}
			label="Related words"
		/>
		<!-- Related kanjis -->
		<RelatedItemsFragment
			bind:value={counter.relatedKanjis}
			error={errors.relatedKanjis}
			itemId={counter.id}
			relatedType={ItemType.KANJI}
			label="Related kanjis"
		/>
		<!-- Related counters -->
		<RelatedItemsFragment
			bind:value={counter.relatedCounters}
			error={errors.relatedCounters}
			itemId={counter.id}
			relatedType={ItemType.COUNTER}
			label="Related counters"
		/>
	{/snippet}
</CreateItemPage>
