<script lang="ts">
	import {
		setWordStudySessionSessionContext,
		wordStudySessionLocalStorage,
	} from "$lib/study_session"
	import type { LayoutProps } from "./$types"

	let { data, children }: LayoutProps = $props()

	let session = $state({
		params: data.params,
		words: data.words,
	})

	setWordStudySessionSessionContext(session)

	$effect(() => {
		wordStudySessionLocalStorage.params = session.params
	})
</script>

{@render children?.()}
