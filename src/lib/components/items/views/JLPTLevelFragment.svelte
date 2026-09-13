<script lang="ts">
	import { JLPT_LEVEL_COLOR } from "$lib/colors"
	import Labeled from "$lib/components/Labeled.svelte"
	import type { JLPTLevel } from "$lib/model"
	import { JLPT_LEVEL_PRETTY_STRING } from "$lib/strings"

	export interface JLPTLevelFragmentProps {
		jlptLevel?: JLPTLevel | undefined
		class?: string | undefined
	}

	let { jlptLevel, ...props }: JLPTLevelFragmentProps = $props()
</script>

<Labeled
	label="JLPT Level"
	class="text-center {props.class ?? ''}"
>
	{#if jlptLevel}
		<p style:color={JLPT_LEVEL_COLOR[jlptLevel]}>
			{JLPT_LEVEL_PRETTY_STRING[jlptLevel]}
		</p>
	{:else}
		<p class="text-neutral-400">-</p>
	{/if}
</Labeled>
