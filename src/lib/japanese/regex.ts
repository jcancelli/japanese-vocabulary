/*
Source - https://stackoverflow.com/a/15034560
Posted by nhahtdh, modified by community. See post 'Timeline' for change history
Retrieved 2026-07-29, License - CC BY-SA 3.0

/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/
  -------------_____________-------------_____________-------------_____________
   Punctuation   Hiragana     Katakana    Full-width       CJK      CJK Ext. A
											Roman/      (Common &      (Rare)    
										  Half-width    Uncommon)
										   Katakana

https://regex101.com/r/0LkDH8/1
[\x3400-\x4DB5\x4E00-\x9FCB\xF900-\xFA6A] kanji
*/

export const hiraganaCharacherRegex = /[\u3040-\u309f]/g
export const katakanaCharacherRegex = /[\u30a0-\u30ff]/g
export const kanaCharacterRegex = /[\u3040-\u309f\u30a0-\u30ff]/g
export const kanjiKanaCharacterRegex =
	/[\u3040-\u309f\u30a0-\u30ff\u3400-\u4DB5\u4E00-\u9FCB\uF900-\uFA6A]/g
export const nonHiraganaCharacherRegex = /[^\u3040-\u309f]/g
export const nonKatakanaCharacherRegex = /[^\u30a0-\u30ff]/g
export const nonKanaCharacterRegex = /[^\u3040-\u309f\u30a0-\u30ff]/g
export const nonKanjiKanaCharacterRegex =
	/[^\u3040-\u309f\u30a0-\u30ff\u3400-\u4DB5\u4E00-\u9FCB\uF900-\uFA6A]/g
export const hiraganaStringRegex = /^[\u3040-\u309f]*$/g
export const katakanaStringRegex = /^[\u30a0-\u30ff]*$/g
export const kanaStringRegex = /^[\u3040-\u309f\u30a0-\u30ff]*$/g
export const kanjiKanaStringRegex =
	/^[\u3040-\u309f\u30a0-\u30ff\u3400-\u4DB5\u4E00-\u9FCB\uF900-\uFA6A]*$/g
