<script lang="ts">
	import { storage } from "$lib/local_storage"
	import { setWordStudySessionSessionContext } from "$lib/study_session"
	import type { LayoutProps } from "./$types"

	let { data, children }: LayoutProps = $props()

	let session = $state({
		params: data.params,
		words: data.words,
		step: data.step,
	})

	setWordStudySessionSessionContext(session)

	$effect(() => {
		storage.wordStudySession.params = session.params
	})
</script>

{@render children?.()}
