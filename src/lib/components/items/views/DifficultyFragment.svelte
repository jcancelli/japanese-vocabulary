<script lang="ts">
	import Labeled from "$lib/components/Labeled.svelte"
	import type { Difficulty } from "$lib/model"

	export interface DifficultyFragmentProps {
		difficulty: Difficulty
		class?: string | undefined
	}

	let { difficulty, ...props }: DifficultyFragmentProps = $props()
</script>

<Labeled
	label="Difficulty"
	class="text-center {props.class ?? ''}"
>
	<p>
		{difficulty}/5
	</p>
</Labeled>
