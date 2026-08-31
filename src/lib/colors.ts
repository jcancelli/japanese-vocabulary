import { JLPTLevel, Difficulty, WordType } from "./model"

export const WORD_TYPE_COLOR = {
	[WordType.NOUN]: "#d791e6",
	[WordType.VERB]: "#dbbd68",
	[WordType.ADVERB]: "#7eb9dc",
	[WordType.ADJECTIVE]: "#8dc584",
	[WordType.PRE_NOUN_ADJECTIVAL]: "#e48d86",
} as const

export const JLPT_LEVEL_COLOR = {
	[JLPTLevel.N5]: "#6a3f00",
	[JLPTLevel.N4]: "#8a8a8a",
	[JLPTLevel.N3]: "#a48600",
	[JLPTLevel.N2]: "#1d2e7d",
	[JLPTLevel.N1]: "#610a6d",
} as const

export const DIFFICULTY_COLOR = {
	[Difficulty.DONT_KNOW]: "#ff0000",
	[Difficulty.KINDA_DONT_KNOW]: "#ffb500",
	[Difficulty.KINDA_KNOW]: "#ffff00",
	[Difficulty.KNOW]: "#b5ff00",
	[Difficulty.UNFORGETTABLE]: "#00ff00",
} as const
