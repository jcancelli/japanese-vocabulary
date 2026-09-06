import z from "zod"
import { AdjectiveType, JLPTLevel, SimpleWordType, VerbType, WordType, type UUIDv4 } from "./model"
import { hiraganaStringRegex, kanaStringRegex, kanjiKanaStringRegex } from "./japanese/regex"
import { capitalizeString } from "./strings"

export const UUIDv4Schema = z.custom<UUIDv4>((value) => {
	return z.uuidv4().safeParse(value).success
}, "Invalid UUIDv4")
export const WordTypeSchema = z.enum(WordType, "Invalid word type")
export const SimpleWordTypeSchema = z.enum(SimpleWordType, "Invalid simple word type")
export const JLPTLevelSchema = z.enum(JLPTLevel, "Invalid JLPT level")
export const DifficultySchema = z.int().min(1, "Invalid difficulty").max(5, "Invalid difficulty")
export const KanjiStringSchema = z
	.string()
	.trim()
	.regex(kanjiKanaStringRegex, "Non kanji/kana character found")
export const KanaStringSchema = z.string().trim().regex(kanaStringRegex, "Non-kana character found")
export const HiraganaStringSchema = z
	.string()
	.trim()
	.regex(hiraganaStringRegex, "Non-hiragana character found")
export const VerbTypeSchema = z.enum(VerbType, "Invalid verb type")
export const VerbTransitivitySchema = z.object({
	transitive: z.boolean(),
	intransitive: z.boolean(),
})
export const AdjectiveTypeSchema = z.enum(AdjectiveType, "Invalid adjective type")
export const MeaningSchema = z.object(
	{
		meaning: z.string().trim().nonempty().transform(capitalizeString),
		note: z
			.string()
			.trim()
			.transform((v) => (v === "" ? undefined : v.toLowerCase()))
			.optional(),
	},
	"Invalid meaning",
)
export const MeaningsSchema = z.array(MeaningSchema).nonempty("At least one meaning is needed")
export const ExampleSentenceSchema = z.object(
	{
		japanese: z.string().trim().nonempty().transform(capitalizeString),
		english: z.string().trim().nonempty().transform(capitalizeString),
	},
	"Invalid example sentence",
)
export const CounterVariantsSchema = z.object({
	1: KanaStringSchema.optional(),
	2: KanaStringSchema.optional(),
	3: KanaStringSchema.optional(),
	4: KanaStringSchema.optional(),
	5: KanaStringSchema.optional(),
	6: KanaStringSchema.optional(),
	7: KanaStringSchema.optional(),
	8: KanaStringSchema.optional(),
	9: KanaStringSchema.optional(),
	10: KanaStringSchema.optional(),
	11: KanaStringSchema.optional(),
})
export const TagSchema = z.string().regex(/^[a-z\-]+$/g, "Invalid character")
export const TagsSchema = z.array(TagSchema).refine(isSetLikeArray, "Duplicate tag")
export const UUIDv4SetSchema = z.array(UUIDv4Schema).refine(isSetLikeArray, "Duplicate id")
export const WordSchema = z.object({
	id: UUIDv4Schema,
	wordType: WordTypeSchema,
	kanji: KanjiStringSchema.nonempty("Empty field").optional(),
	kana: KanaStringSchema.nonempty("Empty field"),
	meanings: MeaningsSchema,
	jlptLevel: JLPTLevelSchema.optional(),
	difficulty: DifficultySchema,
	lastStudiedAt: z.date().optional(),
	examples: z.array(ExampleSentenceSchema),
	tags: TagsSchema,
	relatedWords: UUIDv4SetSchema,
	relatedKanjis: UUIDv4SetSchema,
	relatedCounters: UUIDv4SetSchema,
})
export const SimpleWordSchema = WordSchema.extend({
	wordType: z.literal(WordType.SIMPLE),
	wordSybtypes: z.array(SimpleWordTypeSchema).nonempty().refine(isSetLikeArray),
})
export const VerbSchema = WordSchema.extend({
	wordType: z.literal(WordType.VERB),
	verbType: VerbTypeSchema.optional(),
	transitivity: VerbTransitivitySchema.optional(),
})
export const AdjectiveSchema = WordSchema.extend({
	wordType: z.literal(WordType.ADJECTIVE),
	adjectiveType: AdjectiveTypeSchema.optional(),
})
export const KanjiSchema = z.object({
	id: UUIDv4Schema,
	kanji: KanjiStringSchema.nonempty("Empty field"),
	onyomi: z.array(KanaStringSchema).refine(isSetLikeArray, "Duplicate on'yomi"),
	kunyomi: z.array(KanaStringSchema).refine(isSetLikeArray, "Duplicate kun'yomi"),
	nanori: z.array(KanaStringSchema).refine(isSetLikeArray, "Duplicate naori"),
	meanings: MeaningsSchema,
	jlptLevel: JLPTLevelSchema.optional(),
	difficulty: DifficultySchema,
	lastStudiedAt: z.date().optional(),
	tags: TagsSchema,
	relatedWords: UUIDv4SetSchema,
	relatedKanjis: UUIDv4SetSchema,
	relatedCounters: UUIDv4SetSchema,
})
export const CounterSchema = z.object({
	id: UUIDv4Schema,
	writing: KanaStringSchema.nonempty("Empty field"),
	variants: CounterVariantsSchema,
	meanings: MeaningsSchema,
	jlptLevel: JLPTLevelSchema.optional(),
	difficulty: DifficultySchema,
	lastStudiedAt: z.date().optional(),
	examples: z.array(ExampleSentenceSchema),
	tags: TagsSchema,
	relatedWords: UUIDv4SetSchema,
	relatedKanjis: UUIDv4SetSchema,
	relatedCounters: UUIDv4SetSchema,
})

export function isSetLikeArray<T>(array: T[]): boolean {
	return array.length === new Set(array).size
}
