<script lang="ts">
	import { storage } from "$lib/local_storage"
	import { setWordStudySessionContext } from "$lib/study_session"
	import type { LayoutProps } from "./$types"

	let { data, children }: LayoutProps = $props()

	let session = $state({
		params: data.params,
		words: data.words,
		step: data.step,
	})

	setWordStudySessionContext(session)

	$effect(() => {
		storage.wordStudySession.params = session.params
	})
</script>

{@render children?.()}
