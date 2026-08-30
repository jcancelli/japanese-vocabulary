import { JLPTLevel, WordDifficulty } from "$lib/model"
import { createContext } from "svelte"
import type { WordDTO } from "./dto.svelte"

export const [getWordStudySessionContext, setWordStudySessionSessionContext] =
	createContext<WordStudySession>()

export const WORD_STUDY_SESSION_LOCAL_STORAGE_KEY = "wordStudySession"

export const wordStudySessionLocalStorage = {
	get params(): WordStudySessionParams {
		const key = `${WORD_STUDY_SESSION_LOCAL_STORAGE_KEY}.params`
		const val = localStorage.getItem(key)
		if (val) {
			return JSON.parse(val)
		}
		return {
			tags: {
				only: [],
				without: [],
			},
			jlptLevel: {
				[JLPTLevel.N5]: false,
				[JLPTLevel.N4]: false,
				[JLPTLevel.N3]: false,
				[JLPTLevel.N2]: false,
				[JLPTLevel.N1]: false,
			},
			difficulty: {
				[WordDifficulty.DONT_KNOW]: false,
				[WordDifficulty.KINDA_DONT_KNOW]: false,
				[WordDifficulty.KINDA_KNOW]: false,
				[WordDifficulty.KNOW]: false,
				[WordDifficulty.UNFORGETTABLE]: false,
			},
			language: {
				[StudySessionLanguage.ENG_TO_JAP]: false,
				[StudySessionLanguage.JAP_TO_ENG]: false,
			},
			sort: {
				by: WordStudySessionSortingField.DIFFICULTY,
				order: "descending",
			},
		}
	},

	set params(value: WordStudySessionParams) {
		const key = `${WORD_STUDY_SESSION_LOCAL_STORAGE_KEY}.params`
		localStorage.setItem(key, JSON.stringify(value))
	},
}

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
		[key in WordDifficulty]: boolean
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
