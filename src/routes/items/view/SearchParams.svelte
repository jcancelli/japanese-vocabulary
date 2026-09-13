<script lang="ts">
	import { ItemType, JLPTLevel, type Difficulty } from "$lib/model"
	import { ITEM_TYPE_PRETTY_STRING, JLPT_LEVEL_PRETTY_STRING } from "$lib/strings"
	import { Checkbox } from "flowbite-svelte"

	export interface SearchParamsProps {
		types: Set<ItemType>
		tags: Set<string>
		difficulties: Set<Difficulty>
		jlptLevels: Set<JLPTLevel | undefined>
		class?: string
	}

	let { types, tags, difficulties, jlptLevels, ...props }: SearchParamsProps = $props()
</script>

<div class="p-4 {props.class ?? ''}">
	<div class="flex flex-row flex-wrap gap-4">
		<!-- Item type -->
		<div>
			<h4>Type</h4>
			{#snippet ItemTypeCheckbox(itemType: ItemType)}
				<Checkbox
					bind:checked={
						() => types.has(itemType),
						(checked) => (checked ? types.add(itemType) : types.delete(itemType))
					}
				>
					{ITEM_TYPE_PRETTY_STRING[itemType]}
				</Checkbox>
			{/snippet}
			<div>
				{@render ItemTypeCheckbox(ItemType.WORD)}
				{@render ItemTypeCheckbox(ItemType.KANJI)}
				{@render ItemTypeCheckbox(ItemType.COUNTER)}
			</div>
		</div>
		<!-- TODO: Tags -->

		<!-- Difficulties -->
		<div>
			<h4>Difficulty</h4>
			{#snippet ItemDifficultyCheckbox(difficulty: Difficulty)}
				<Checkbox
					bind:checked={
						() => difficulties.has(difficulty),
						(checked) =>
							checked ? difficulties.add(difficulty) : difficulties.delete(difficulty)
					}
				>
					{difficulty}
				</Checkbox>
			{/snippet}
			<div>
				{@render ItemDifficultyCheckbox(1)}
				{@render ItemDifficultyCheckbox(2)}
				{@render ItemDifficultyCheckbox(3)}
				{@render ItemDifficultyCheckbox(4)}
				{@render ItemDifficultyCheckbox(5)}
			</div>
		</div>
		<!-- JLPT Level -->
		<div>
			<h4>JLPT level</h4>
			{#snippet ItemJLPTLevelCheckbox(level: JLPTLevel | undefined)}
				<Checkbox
					bind:checked={
						() => jlptLevels.has(level),
						(checked) => (checked ? jlptLevels.add(level) : jlptLevels.delete(level))
					}
				>
					{level ? JLPT_LEVEL_PRETTY_STRING[level] : "undefined"}
				</Checkbox>
			{/snippet}
			<div>
				{@render ItemJLPTLevelCheckbox(JLPTLevel.N1)}
				{@render ItemJLPTLevelCheckbox(JLPTLevel.N2)}
				{@render ItemJLPTLevelCheckbox(JLPTLevel.N3)}
				{@render ItemJLPTLevelCheckbox(JLPTLevel.N4)}
				{@render ItemJLPTLevelCheckbox(JLPTLevel.N5)}
				{@render ItemJLPTLevelCheckbox(undefined)}
			</div>
		</div>
	</div>
</div>
