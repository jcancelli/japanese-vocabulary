<script lang="ts">
	import { storage } from "$lib/local_storage"
	import { setKanjiStudySessionContext } from "$lib/study_session"
	import type { LayoutProps } from "./$types"

	let { data, children }: LayoutProps = $props()

	let session = $state({
		params: data.params,
		kanjis: data.kanjis,
		step: data.step,
	})

	setKanjiStudySessionContext(session)

	$effect(() => {
		storage.kanjiStudySession.params = session.params
	})
</script>

{@render children?.()}
