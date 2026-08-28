<script lang="ts">
	import Drawing from "$lib/drawing/Drawing.svelte"
	import { Button, ButtonGroup, Checkbox, Input, Label, Range } from "flowbite-svelte"

	let drawing: Drawing
	let strokeWidth = $state(1)
	let strokeColor = $state("#000000")
	let denoiserThreshold = $state(0)
	let showDebugMarkers = $state(false)
</script>

<svelte:head>
	<title>Sandbox</title>
</svelte:head>

<Drawing
	bind:this={drawing}
	{strokeWidth}
	{strokeColor}
	{denoiserThreshold}
	{showDebugMarkers}
	class="mx-auto mt-6 size-80 cursor-crosshair border-2 border-black"
/>

<div class="mx-auto mt-4 grid grid-cols-3 gap-3 px-6">
	<ButtonGroup class="col-span-3 mx-auto">
		<Button onclick={() => drawing.clear()}>clear</Button>
		<Button onclick={() => drawing.undo()}>undo</Button>
		<Button onclick={() => drawing.redo()}>redo</Button>
	</ButtonGroup>

	<div class="col-span-3 flex flex-row items-center justify-center gap-4">
		<Label>
			Show debug vertices
			<Checkbox bind:checked={showDebugMarkers} />
		</Label>
	</div>

	<Label class="col-span-3">
		Stroke width - {strokeWidth}px
		<Range
			bind:value={strokeWidth}
			min={1}
			max={20}
			step={0.1}
		/>
	</Label>
	<Label class="col-span-3">
		Stroke color
		<Input
			type="color"
			bind:value={strokeColor}
		/>
	</Label>
	<Label class="col-span-3">
		Denoiser threshold - {denoiserThreshold}px
		<Range
			bind:value={denoiserThreshold}
			min={0}
			max={20}
			step={0.1}
		/>
	</Label>
</div>
