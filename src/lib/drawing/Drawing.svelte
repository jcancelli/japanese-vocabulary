<script lang="ts">
	import { onMount } from "svelte"
	import { Drawing } from "./drawing.svelte"
	import { makeDenoiseFilter, Pointer } from "./pointer.svelte"
	import type { Stroke, Vec2 } from "./stroke.svelte"

	export interface DrawingProps {
		strokeWidth?: number
		strokeColor?: string
		denoiserThreshold?: number
		showDebugMarkers?: boolean
		class?: string
	}

	let {
		strokeWidth = 1,
		strokeColor = "#000000",
		denoiserThreshold = 0,
		showDebugMarkers = false,
		...props
	}: DrawingProps = $props()

	let svg: SVGSVGElement
	let drawing: Drawing

	const denoiseFilter = $derived(makeDenoiseFilter(denoiserThreshold))
	const pointer = $derived(new Pointer().addFilter(denoiseFilter))

	onMount(() => {
		drawing = new Drawing(svg)

		const strokeListener = (stroke: Stroke) => drawing.stroke(stroke)
		pointer.attach(svg)
		pointer.addStrokeListener(strokeListener)

		document.addEventListener("keydown", onKeyDown)

		return () => {
			pointer.removeStrokeListener(strokeListener)
			pointer.detach(svg)

			document.removeEventListener("keydown", onKeyDown)
		}
	})

	$effect(() => {
		pointer.stroke.color = strokeColor
	})

	$effect(() => {
		pointer.stroke.width = strokeWidth
	})

	export function clear(): void {
		drawing.clear()
	}

	export function undo(): void {
		drawing.undo()
	}

	export function redo(): void {
		drawing.redo()
	}

	function onKeyDown(e: KeyboardEvent): void {
		switch (e.key.toLowerCase()) {
			case "z":
				if (!e.ctrlKey) {
					return
				}
				if (e.shiftKey) {
					drawing.redo()
				} else {
					drawing.undo()
				}
				return
		}
	}
</script>

{#snippet debugMarker(point: Vec2, color: string)}
	<div
		class="pointer-events-none absolute z-10 size-1.5 rounded-full"
		style:background-color={color}
		style:top="{point.y}px"
		style:left="{point.x}px"
	></div>
{/snippet}

<div class="relative {props.class ?? ''}">
	<svg
		bind:this={svg}
		xmlns="http://www.w3.org/2000/svg"
		class="size-full"
	></svg>
	{#if showDebugMarkers}
		{#each drawing.strokes as stroke}
			{#each stroke.points as point}
				{@render debugMarker(point, "#ff0000")}
			{/each}
		{/each}
		{#each pointer.stroke.points as point}
			{@render debugMarker(point, "#00ff00")}
		{/each}
	{/if}
</div>
