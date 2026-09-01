import type { KanjiDTO, WordDTO } from "$lib/dto.svelte"
import { Difficulty, JLPTLevel } from "$lib/model"
import {
	KanjiStudySessionSortingField,
	WordStudySessionSortingField,
	type KanjiStudySessionParams,
	type WordStudySessionParams,
} from "$lib/study_session"
import { db } from "./database"
import { getKanjis } from "./kanjis"
import { getWords } from "./words"

export async function getStudySessionWords(params: WordStudySessionParams): Promise<WordDTO[]> {
	// Difficulty
	const difficulties: Difficulty[] = []
	params.difficulty[Difficulty.DONT_KNOW] && difficulties.push(Difficulty.DONT_KNOW)
	params.difficulty[Difficulty.KINDA_DONT_KNOW] && difficulties.push(Difficulty.KINDA_DONT_KNOW)
	params.difficulty[Difficulty.KINDA_KNOW] && difficulties.push(Difficulty.KINDA_KNOW)
	params.difficulty[Difficulty.KNOW] && difficulties.push(Difficulty.KNOW)
	params.difficulty[Difficulty.UNFORGETTABLE] && difficulties.push(Difficulty.UNFORGETTABLE)
	let query = db.words.where("difficulty").anyOf(difficulties)

	// JLPT level
	const jlptLevels: JLPTLevel[] = []
	params.jlptLevel[JLPTLevel.N5] && jlptLevels.push(JLPTLevel.N5)
	params.jlptLevel[JLPTLevel.N3] && jlptLevels.push(JLPTLevel.N4)
	params.jlptLevel[JLPTLevel.N3] && jlptLevels.push(JLPTLevel.N3)
	params.jlptLevel[JLPTLevel.N2] && jlptLevels.push(JLPTLevel.N2)
	params.jlptLevel[JLPTLevel.N1] && jlptLevels.push(JLPTLevel.N1)
	query = query.and((word) => jlptLevels.includes(word.jlptLevel))

	// Tags
	if (params.tags.only.length > 0) {
		query = query.and((word) => {
			return params.tags.only.every((tag) => word.tags.includes(tag))
		})
	}
	if (params.tags.without.length > 0) {
		query = query.and((word) => {
			return word.tags.every((tag) => !params.tags.without.includes(tag))
		})
	}

	// Perform query
	const wordIds = await query.primaryKeys()
	const words = await getWords(wordIds)

	// Sorting
	let sortFunction: (a: WordDTO, b: WordDTO) => number
	switch (params.sort.by) {
		case WordStudySessionSortingField.DIFFICULTY:
			switch (params.sort.order) {
				case "ascending":
					sortFunction = (a, b) => a.difficulty - b.difficulty
					break
				case "descending":
					sortFunction = (a, b) => b.difficulty - a.difficulty
					break
				default:
					throw new Error(`Invalid sort order: ${params.sort.order}`)
			}
			break
		case WordStudySessionSortingField.LAST_STUDIED:
			switch (params.sort.order) {
				case "ascending":
					sortFunction = (a, b) => a.lastStudiedAt.valueOf() - b.lastStudiedAt.valueOf()
					break
				case "descending":
					sortFunction = (a, b) => b.lastStudiedAt.valueOf() - a.lastStudiedAt.valueOf()
					break
				default:
					throw new Error(`Invalid sort order: ${params.sort.order}`)
			}
			break
		default:
			throw new Error(`Invalid sort by: ${params.sort.by}`)
	}
	words.sort(sortFunction)

	return words
}

export async function getStudySessionKanjis(params: KanjiStudySessionParams): Promise<KanjiDTO[]> {
	// Difficulty
	const difficulties: Difficulty[] = []
	params.difficulty[Difficulty.DONT_KNOW] && difficulties.push(Difficulty.DONT_KNOW)
	params.difficulty[Difficulty.KINDA_DONT_KNOW] && difficulties.push(Difficulty.KINDA_DONT_KNOW)
	params.difficulty[Difficulty.KINDA_KNOW] && difficulties.push(Difficulty.KINDA_KNOW)
	params.difficulty[Difficulty.KNOW] && difficulties.push(Difficulty.KNOW)
	params.difficulty[Difficulty.UNFORGETTABLE] && difficulties.push(Difficulty.UNFORGETTABLE)
	let query = db.kanjis.where("difficulty").anyOf(difficulties)

	// JLPT level
	const jlptLevels: JLPTLevel[] = []
	params.jlptLevel[JLPTLevel.N5] && jlptLevels.push(JLPTLevel.N5)
	params.jlptLevel[JLPTLevel.N3] && jlptLevels.push(JLPTLevel.N4)
	params.jlptLevel[JLPTLevel.N3] && jlptLevels.push(JLPTLevel.N3)
	params.jlptLevel[JLPTLevel.N2] && jlptLevels.push(JLPTLevel.N2)
	params.jlptLevel[JLPTLevel.N1] && jlptLevels.push(JLPTLevel.N1)
	query = query.and((kanji) => jlptLevels.includes(kanji.jlptLevel))

	// Tags
	if (params.tags.only.length > 0) {
		query = query.and((kanji) => {
			return params.tags.only.every((tag) => kanji.tags.includes(tag))
		})
	}
	if (params.tags.without.length > 0) {
		query = query.and((kanji) => {
			return kanji.tags.every((tag) => !params.tags.without.includes(tag))
		})
	}

	// Perform query
	const kanjiIds = await query.primaryKeys()
	const kanjis = await getKanjis(kanjiIds)

	// Sorting
	let sortFunction: (a: KanjiDTO, b: KanjiDTO) => number
	switch (params.sort.by) {
		case KanjiStudySessionSortingField.DIFFICULTY:
			switch (params.sort.order) {
				case "ascending":
					sortFunction = (a, b) => a.difficulty - b.difficulty
					break
				case "descending":
					sortFunction = (a, b) => b.difficulty - a.difficulty
					break
				default:
					throw new Error(`Invalid sort order: ${params.sort.order}`)
			}
			break
		case KanjiStudySessionSortingField.LAST_STUDIED:
			switch (params.sort.order) {
				case "ascending":
					sortFunction = (a, b) => a.lastStudiedAt.valueOf() - b.lastStudiedAt.valueOf()
					break
				case "descending":
					sortFunction = (a, b) => b.lastStudiedAt.valueOf() - a.lastStudiedAt.valueOf()
					break
				default:
					throw new Error(`Invalid sort order: ${params.sort.order}`)
			}
			break
		default:
			throw new Error(`Invalid sort by: ${params.sort.by}`)
	}
	kanjis.sort(sortFunction)

	return kanjis
}
