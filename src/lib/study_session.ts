import { JLPTLevel, Difficulty } from "$lib/model"
import { createContext } from "svelte"
import type { WordDTO } from "./dto.svelte"

export const [getWordStudySessionContext, setWordStudySessionSessionContext] =
	createContext<WordStudySession>()

export interface WordStudySession {
	params: WordStudySessionParams
	words: WordDTO[]
	step: WordStudySessionStep
}

export enum WordStudySessionStep {
	CONFIGURE = "configure",
	STUDY = "study",
	FINISHED = "finished",
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
