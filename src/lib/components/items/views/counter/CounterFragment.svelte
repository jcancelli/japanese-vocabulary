<script lang="ts">
	export interface CounterFragmentProps {
		primaryWriting: string
		class?: string | undefined
	}

	let { primaryWriting, ...props }: CounterFragmentProps = $props()
</script>

<div class="text-center text-8xl font-bold {props.class ?? ''}">
	<h2>
		{primaryWriting}
	</h2>
</div>
