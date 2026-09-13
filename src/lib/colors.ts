import { JLPTLevel, WordType, ItemType, SimpleWordType } from "./model"

export const ITEM_TYPE_COLOR = {
	[ItemType.WORD]: "#de7567",
	[ItemType.KANJI]: "#6fd668",
	[ItemType.COUNTER]: "#8db2ff",
} as const

export const WORD_TYPE_COLOR = {
	[WordType.SIMPLE]: "#8757a1",
	[WordType.VERB]: "#dbbd68",
	[WordType.ADJECTIVE]: "#8dc584",
} as const

export const WORD_SUBTYPE_COLOR = {
	[SimpleWordType.NOUN]: "#d791e6",
	[SimpleWordType.ADVERB]: "#7eb9dc",
	[SimpleWordType.PRE_NOUN_ADJECTIVAL]: "#e48d86",
} as const

export const JLPT_LEVEL_COLOR = {
	[JLPTLevel.N5]: "#6a3f00",
	[JLPTLevel.N4]: "#8a8a8a",
	[JLPTLevel.N3]: "#a48600",
	[JLPTLevel.N2]: "#1d2e7d",
	[JLPTLevel.N1]: "#610a6d",
} as const

export const DIFFICULTY_COLOR = {
	[5]: "#ff0000",
	[4]: "#ffb500",
	[3]: "#ffff00",
	[2]: "#b5ff00",
	[1]: "#00ff00",
} as const
