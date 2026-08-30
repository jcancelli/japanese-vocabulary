import { AdjectiveType, JLPTLevel, VerbType, WordDifficulty, WordType } from "./model"
import { StudySessionLanguage } from "./study_session"

export const JLPT_LEVEL_PRETTY_STRING = {
	[JLPTLevel.N1]: "N1",
	[JLPTLevel.N2]: "N2",
	[JLPTLevel.N3]: "N3",
	[JLPTLevel.N4]: "N4",
	[JLPTLevel.N5]: "N5",
} as const

export const WORD_DIFFICULTY_PRETTY_STRING = {
	[WordDifficulty.DONT_KNOW]: "Don't know",
	[WordDifficulty.KINDA_DONT_KNOW]: "Kinda don't know",
	[WordDifficulty.KINDA_KNOW]: "Kinda know",
	[WordDifficulty.KNOW]: "Know",
	[WordDifficulty.UNFORGETTABLE]: "Unforgettable",
} as const

export const WORD_TYPE_PRETTY_STRING = {
	[WordType.NOUN]: "Noun",
	[WordType.VERB]: "Verb",
	[WordType.ADVERB]: "Adverb",
	[WordType.ADJECTIVE]: "Adjective",
	[WordType.PRE_NOUN_ADJECTIVAL]: "Pre-noun adjectival",
} as const

export const VERB_TYPE_PRETTY_STRING = {
	[VerbType.GODAN]: "Godan",
	[VerbType.ICHIDAN]: "Ichidan",
	[VerbType.SURU]: "Suru",
	[VerbType.KURU]: "Kuru",
} as const

export const ADJECTIVE_TYPE_PRETTY_STRING = {
	[AdjectiveType.I]: "I-adjective",
	[AdjectiveType.NA]: "Na-adjective",
} as const

export const STUDY_SESSION_LANGUAGE_PRETTY_STRING = {
	[StudySessionLanguage.ENG_TO_JAP]: "🇬🇧 ➜ 🇯🇵",
	[StudySessionLanguage.JAP_TO_ENG]: "🇯🇵 ➜ 🇬🇧",
} as const

export function capitalizeString(str: string): string {
	if (str.length === 0) {
		return str
	}
	return str[0].toUpperCase() + str.substring(1).toLowerCase()
}
