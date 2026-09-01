import { Difficulty, JLPTLevel } from "./model"
import {
	StudySessionLanguage,
	WordStudySessionSortingField,
	type WordStudySessionParams,
} from "./study_session"

const wordStudySessionParamsVersion = 1
const wordStudySessionParamsKey = "wordStudySessionParams"

export const wordStudySessionStorage = {
	get params(): WordStudySessionParams {
		const val = localStorage.getItem(wordStudySessionParamsKey)
		if (val) {
			const params = JSON.parse(val)
			if (params.version === wordStudySessionParamsVersion) {
				return params
			}
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
				[Difficulty.DONT_KNOW]: false,
				[Difficulty.KINDA_DONT_KNOW]: false,
				[Difficulty.KINDA_KNOW]: false,
				[Difficulty.KNOW]: false,
				[Difficulty.UNFORGETTABLE]: false,
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
		localStorage.setItem(
			wordStudySessionParamsKey,
			JSON.stringify({
				...value,
				version: wordStudySessionParamsVersion,
			}),
		)
	},
}

export const storage = {
	wordStudySession: wordStudySessionStorage,
}
