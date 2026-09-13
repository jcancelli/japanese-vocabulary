<script lang="ts">
	export interface KanjiKanaFragmentProps {
		kanji?: string | undefined
		kana: string
		class?: string | undefined
	}

	let { kanji = $bindable(), kana = $bindable(), ...props }: KanjiKanaFragmentProps = $props()
</script>

<div class="text-center {props.class ?? ''}">
	{#if kanji}
		<h2 class="text-5xl font-bold">
			{kanji}
		</h2>
		<h3 class="text-md mt-2 font-semibold">
			{kana}
		</h3>
	{:else}
		<h2 class="text-5xl font-bold">
			{kana}
		</h2>
	{/if}
</div>
