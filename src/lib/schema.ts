import z from "zod"
import { AdjectiveType, JLPTLevel, VerbType, WordDifficulty, WordType, type UUIDv4 } from "./model"
import { kanaStringRegex, kanjiKanaStringRegex } from "./japanese/regex"
import { capitalizeString } from "./strings"

export const UUIDv4Schema = z.custom<UUIDv4>((value) => {
	return z.uuidv4().safeParse(value).success
}, "Invalid UUIDv4")
export const WordTypeSchema = z.enum(WordType, "Invalid word type")
export const JLPTLevelSchema = z.enum(JLPTLevel, "Invalid JLPT level")
export const WordDifficultySchema = z.enum(WordDifficulty, "Invalid difficulty")
export const KanjiStringSchema = z
	.string()
	.trim()
	.regex(kanjiKanaStringRegex, "Non kanji/kana character found")
export const KanaStringSchema = z.string().trim().regex(kanaStringRegex, "Non-kana character found")
export const VerbTypeSchema = z.enum(VerbType, "Invalid verb type")
export const VerbTransitivitySchema = z.object({
	transitive: z.boolean(),
	intransitive: z.boolean(),
})
export const AdjectiveTypeSchema = z.enum(AdjectiveType, "Invalid adjective type")
export const WordMeaningSchema = z.object(
	{
		meaning: z.string().trim().nonempty().transform(capitalizeString),
		note: z
			.string()
			.trim()
			.transform((v) => (v === "" ? undefined : capitalizeString(v)))
			.optional(),
	},
	"Invalid word meaning",
)
export const ExampleSentenceSchema = z.object(
	{
		japanese: z.string().trim().nonempty().transform(capitalizeString),
		english: z.string().trim().nonempty().transform(capitalizeString),
	},
	"Invalid example sentence",
)
export const TagSchema = z.string().regex(/^[a-z\-]+$/g, "Invalid character")
export const WordSchema = z.object({
	id: UUIDv4Schema,
	wordType: WordTypeSchema,
	jlptLevel: JLPTLevelSchema,
	difficulty: WordDifficultySchema,
	kanji: KanjiStringSchema.nonempty("Empty field").optional(),
	kana: KanaStringSchema.nonempty("Empty field"),
	meanings: z.array(WordMeaningSchema),
	examples: z.array(ExampleSentenceSchema),
	tags: z.array(TagSchema).refine(isSetLikeArray, "Duplicate tag"),
	relatedWords: z.array(UUIDv4Schema).refine(isSetLikeArray, "Duplicate related word"),
})
export const NounSchema = WordSchema.extend({
	wordType: z.literal(WordType.NOUN),
})
export const VerbSchema = WordSchema.extend({
	wordType: z.literal(WordType.VERB),
	verbType: VerbTypeSchema,
	transitivity: VerbTransitivitySchema,
})
export const AdverbSchema = WordSchema.extend({
	wordType: z.literal(WordType.ADVERB),
})
export const AdjectiveSchema = WordSchema.extend({
	wordType: z.literal(WordType.ADJECTIVE),
	adjectiveType: AdjectiveTypeSchema,
})
export const PreNounAdjectivalSchema = WordSchema.extend({
	wordType: z.literal(WordType.PRE_NOUN_ADJECTIVAL),
})

export function isSetLikeArray<T>(array: T[]): boolean {
	return array.length === new Set(array).size
}
