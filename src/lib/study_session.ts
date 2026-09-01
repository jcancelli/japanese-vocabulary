import { JLPTLevel, Difficulty } from "$lib/model"
import { createContext } from "svelte"
import type { KanjiDTO, WordDTO } from "./dto.svelte"

export const [getWordStudySessionContext, setWordStudySessionContext] =
	createContext<WordStudySession>()
export const [getKanjiStudySessionContext, setKanjiStudySessionContext] =
	createContext<KanjiStudySession>()

export interface WordStudySession {
	params: WordStudySessionParams
	words: WordDTO[]
	step: StudySessionStep
}

export interface KanjiStudySession {
	params: KanjiStudySessionParams
	kanjis: KanjiDTO[]
	step: StudySessionStep
}

export interface WordStudySessionParams {
	tags: {
		only: string[]
		without: string[]
	}
	jlptLevel: {
		[key in JLPTLevel]: boolean
	}
	difficulty: {
		[key in Difficulty]: boolean
	}
	language: {
		[key in StudySessionLanguage]: boolean
	}
	sort: WordStudySessionSorting
}

export interface KanjiStudySessionParams {
	tags: {
		only: string[]
		without: string[]
	}
	jlptLevel: {
		[key in JLPTLevel]: boolean
	}
	difficulty: {
		[key in Difficulty]: boolean
	}
	language: {
		[key in StudySessionLanguage]: boolean
	}
	sort: KanjiStudySessionSorting
}

export enum StudySessionStep {
	CONFIGURE = "configure",
	STUDY = "study",
	FINISHED = "finished",
}

export enum StudySessionLanguage {
	ENG_TO_JAP = "eng_to_jap",
	JAP_TO_ENG = "jap_to_eng",
}

export interface WordStudySessionSorting {
	by: WordStudySessionSortingField
	order: "ascending" | "descending"
}

export enum WordStudySessionSortingField {
	DIFFICULTY = "difficulty",
	LAST_STUDIED = "last_studied",
}

export interface KanjiStudySessionSorting {
	by: KanjiStudySessionSortingField
	order: "ascending" | "descending"
}

export enum KanjiStudySessionSortingField {
	DIFFICULTY = "difficulty",
	LAST_STUDIED = "last_studied",
}
