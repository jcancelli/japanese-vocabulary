<script lang="ts">
	export interface KanjiFragmentProps {
		kanji: string
		class?: string | undefined
	}

	let { kanji, ...props }: KanjiFragmentProps = $props()
</script>

<div class="text-center text-8xl font-bold {props.class ?? ''}">
	<h2 class="mt-10 mb-7 text-center text-8xl font-bold">
		{kanji}
	</h2>
</div>
