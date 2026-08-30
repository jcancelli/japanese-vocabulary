<script lang="ts">
	import type { UUIDv4 } from "$lib/model"
	import { Toast, ToastContainer } from "flowbite-svelte"
	import { fly } from "svelte/transition"
	import ErrorIcon from "flowbite-svelte-icons/ExclamationCircleSolid.svelte"
	import { onDestroy } from "svelte"

	export interface ErrorsFeedProps {
		position?: "top-right" | "bottom-right" | "bottom-left" | "top-left"
		autoDismissTimeoutMs?: number
		class?: string
	}

	let { position = "top-right", autoDismissTimeoutMs, ...props }: ErrorsFeedProps = $props()

	let feed: Error[] = $state([])

	interface Error {
		id: UUIDv4
		message: string
		visible: boolean
		timoutId?: number
	}

	const DISMISS_ANIMATION_DURATION = 800

	export function addError(message: string): void {
		const error: Error = {
			id: crypto.randomUUID(),
			message,
			visible: true,
		}
		if (autoDismissTimeoutMs) {
			error.timoutId = setTimeout(() => {
				delete error.timoutId
				dismissError(error)
			}, autoDismissTimeoutMs)
		}
		feed.unshift(error)
	}

	export function clear(): void {
		for (const error of feed) {
			if (error.timoutId) {
				clearTimeout(error.timoutId)
				delete error.timoutId
			}
		}
		feed = []
	}

	function dismissError(error: Error): void {
		if (error.timoutId) {
			clearTimeout(error.timoutId)
			delete error.timoutId
		}
		error.visible = false
		error.timoutId = setTimeout(() => {
			feed = feed.filter(({ id }) => id !== error.id)
		}, DISMISS_ANIMATION_DURATION + 50)
	}

	onDestroy(() => {
		for (const error of feed) {
			if (error.timoutId) {
				clearTimeout(error.timoutId)
			}
		}
	})
</script>

<ToastContainer
	{position}
	{...props}
>
	{#each feed as error (error.id)}
		<Toast
			color="red"
			dismissable
			transition={fly}
			params={{ x: 200, duration: DISMISS_ANIMATION_DURATION }}
			class="w-64"
			onclose={() => dismissError(error)}
			bind:toastStatus={error.visible}
		>
			{#snippet icon()}
				<ErrorIcon />
			{/snippet}
			{error.message}
		</Toast>
	{/each}
</ToastContainer>
