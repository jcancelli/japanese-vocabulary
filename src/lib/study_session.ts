import type { JLPTLevel, WordDifficulty } from "$lib/model"

export interface WordStudySessionParams {
	tags: {
		only: string[]
		without: string[]
	}
	jlptLevel: {
		[key in JLPTLevel]?: boolean
	}
	difficulty: {
		[key in WordDifficulty]?: boolean
	}
	language: {
		[key in StudySessionLanguage]?: boolean
	}
}

export enum StudySessionLanguage {
	ENG_TO_JAP,
	JAP_TO_ENG,
}

export enum WordStudySessionStep {
	CONFIGURE,
	QUESTION,
	ANSWER_RIGHT,
	ANSWER_WRONG,
	NO_MORE_WORDS,
}
