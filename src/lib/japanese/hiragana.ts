import PrefixTree, { type LongestPrefix } from "$lib/prefix_tree"

const vowels = {
	a: "あ",
	i: "い",
	u: "う",
	e: "え",
	o: "お",
} as const

const k = {
	ka: "か",
	ki: "き",
	ku: "く",
	ke: "け",
	ko: "こ",
} as const

const g = {
	ga: "が",
	gi: "ぎ",
	gu: "ぐ",
	ge: "げ",
	go: "ご",
} as const

const s = {
	sa: "さ",
	shi: "し",
	su: "す",
	se: "せ",
	so: "そ",
} as const

const z = {
	za: "ざ",
	zi: "じ",
	ji: "じ",
	zu: "ず",
	ze: "ぜ",
	zo: "ぞ",
} as const

const t = {
	ta: "た",
	chi: "ち",
	tsu: "つ",
	te: "て",
	to: "と",
} as const

const d = {
	da: "だ",
	di: "ぢ",
	dji: "ぢ",
	dzu: "づ",
	du: "づ",
	de: "で",
	do: "ど",
} as const

const n = {
	na: "な",
	ni: "に",
	nu: "ぬ",
	ne: "ね",
	no: "の",
	nn: "ん",
} as const

const h = {
	ha: "は",
	hi: "ひ",
	hu: "ふ",
	fu: "ふ",
	he: "へ",
	ho: "ほ",
} as const

const b = {
	ba: "ば",
	bi: "び",
	bu: "ぶ",
	be: "べ",
	bo: "ぼ",
} as const

const p = {
	pa: "ぱ",
	pi: "ぴ",
	pu: "ぷ",
	pe: "ぺ",
	po: "ぽ",
} as const

const m = {
	ma: "ま",
	mi: "み",
	mu: "む",
	me: "め",
	mo: "も",
} as const

const y = {
	ya: "や",
	yu: "ゆ",
	yo: "よ",
} as const

const r = {
	ra: "ら",
	ri: "り",
	ru: "る",
	re: "れ",
	ro: "ろ",
} as const

const w = {
	wa: "わ",
	wo: "を",
} as const

const base = {
	...vowels,
	...k,
	...s,
	...t,
	...n,
	...h,
	...m,
	...y,
	...r,
	...w,
} as const

// Dakuten is the name of the symbol
const dakuon = {
	...g,
	...z,
	...d,
	...b,
} as const

// Handakuten is the name of the symbol
const handakuon = {
	...p,
} as const

const comboBase = {
	kya: "きゃ",
	kyu: "きゅ",
	kyo: "きょ",
	sha: "しゃ",
	shu: "しゅ",
	sho: "しょ",
	cha: "ちゃ",
	chu: "ちゅ",
	cho: "ちょ",
	nya: "にゃ",
	nyu: "にゅ",
	nyo: "にょ",
	hya: "ひゃ",
	hyu: "ひゅ",
	hyo: "ひょ",
	mya: "みゃ",
	myu: "みゅ",
	myo: "みょ",
	rya: "りゃ",
	ryu: "りゅ",
	ryo: "りょ",
} as const

const comboDakuon = {
	gya: "ぎゃ",
	gyu: "ぎゅ",
	gyo: "ぎょ",
	ja: "じゃ",
	ju: "じゅ",
	jo: "じょ",
	dya: "ぢゃ",
	dyu: "ぢゅ",
	dyo: "ぢょ",
	bya: "びゃ",
	byu: "びゅ",
	byo: "びょ",
} as const

const comboHandakuon = {
	pya: "ぴゃ",
	pyu: "ぴゅ",
	pyo: "ぴょ",
} as const

const combo = {
	...comboBase,
	...comboDakuon,
	...comboHandakuon,
} as const

const doubleConsonants = {
	kka: "っか",
	kki: "っき",
	kku: "っく",
	kke: "っけ",
	kko: "っこ",

	ssa: "っさ",
	sshi: "っし",
	ssu: "っす",
	sse: "っせ",
	sso: "っそ",

	tta: "った",
	cchi: "っち",
	ttsu: "っつ",
	tte: "って",
	tto: "っと",

	ppa: "っぱ",
	ppi: "っぴ",
	ppu: "っぷ",
	ppe: "っぺ",
	ppo: "っぽ",
} as const

const hiragana = {
	...base,
	...dakuon,
	...handakuon,
	...combo,
	...doubleConsonants,
} as const

const romaji = Object.entries(hiragana).reduce((acc, [roma, hira]) => {
	acc[hira] = roma
	return acc
}, {} as any)

export type Romaji = keyof typeof hiragana
export type Hiragana = (typeof hiragana)[keyof typeof hiragana]

const romajiToHiraganaPrefixTree = PrefixTree.fromRecord<Hiragana>(hiragana)
const hiraganaToRomajiPrefixTree = PrefixTree.fromRecord<Romaji>(romaji)

function romajiToHiragana(romaji: string): string {
	let characters = romaji.split("")
	let output: string[] = []
	let start = 0
	let skipped = 0
	while (start < characters.length) {
		const longestPrefix = romajiToHiraganaPrefixTree.getLongestPrefix(characters, start)
		if (longestPrefix !== undefined) {
			if (skipped > 0) {
				output = output.concat(characters.slice(start - skipped, start))
				skipped = 0
			}
			output.push(longestPrefix.value)
			start = longestPrefix.end
		} else {
			start++
			skipped++
		}
	}
	if (skipped > 0) {
		output = output.concat(characters.slice(start - skipped, start))
	}
	return output.join("")
}

function hiraganaToRomaji(hiragana: string): string {
	let characters = hiragana.split("")
	let output: string[] = []
	let start = 0
	let skipped = 0
	while (start < characters.length) {
		const longestPrefix = hiraganaToRomajiPrefixTree.getLongestPrefix(characters, start)
		if (longestPrefix !== undefined) {
			if (skipped > 0) {
				output = output.concat(characters.slice(start - skipped, start))
				skipped = 0
			}
			output.push(longestPrefix.value)
			start = longestPrefix.end
		} else {
			start++
			skipped++
		}
	}
	if (skipped > 0) {
		output = output.concat(characters.slice(start - skipped, start))
	}
	return output.join("")
}

export default {
	vowels,
	k,
	g,
	s,
	z,
	t,
	d,
	n,
	h,
	b,
	p,
	m,
	y,
	r,
	w,
	base,
	dakuon,
	handakuon,
	comboBase,
	comboDakuon,
	comboHandakuon,
	combo,
	doubleConsonants,
	hiragana,
	romaji,
	prefixTree: {
		romajiToHiragana: romajiToHiraganaPrefixTree,
		hiraganaToRomaji: hiraganaToRomajiPrefixTree,
	} as const,
	fromRomaji: romajiToHiragana,
	toRomaji: hiraganaToRomaji,
} as const
