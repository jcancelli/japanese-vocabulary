<script lang="ts">
	import Labeled from "$lib/components/Labeled.svelte"
	import type { CounterDTO } from "$lib/dto.svelte"

	export interface VariantsFragmentProps {
		counter: CounterDTO
		class?: string | undefined
	}

	let { counter, ...props }: VariantsFragmentProps = $props()

	const NUMBER = {
		1: "一",
		2: "二",
		3: "三",
		4: "四",
		5: "五",
		6: "六",
		7: "七",
		8: "八",
		9: "九",
		10: "十",
		11: "十一",
	} as const
</script>

<Labeled
	label="Variants"
	class={props.class}
>
	<div class="grid grid-cols-3 text-center">
		{#each counter.variants as { n, hiragana }}
			{#if hiragana}
				<p>{n}</p>
				<p>{NUMBER[n as keyof typeof NUMBER]}{counter.counter}</p>
				<p>{hiragana}</p>
			{/if}
		{/each}
	</div>
</Labeled>
