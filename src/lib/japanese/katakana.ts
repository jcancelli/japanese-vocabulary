import PrefixTree from "$lib/prefix_tree"

const vowels = {
	a: "ア",
	i: "イ",
	u: "ウ",
	e: "エ",
	o: "オ",
} as const

const v = {
	va: "ヴァ",
	vi: "ヴィ",
	vu: "ヴ",
	ve: "ヴェ",
	vo: "ヴォ",
} as const

const k = {
	ka: "カ",
	ki: "キ",
	ku: "ク",
	ke: "ケ",
	ko: "コ",
} as const

const g = {
	ga: "ガ",
	gi: "ギ",
	gu: "グ",
	ge: "ゲ",
	go: "ゴ",
} as const

const s = {
	sa: "サ",
	shi: "シ",
	su: "ス",
	se: "セ",
	so: "ソ",
} as const

const z = {
	za: "ザ",
	zi: "ジ",
	ji: "ジ",
	zu: "ズ",
	ze: "ゼ",
	zo: "ゾ",
} as const

const t = {
	ta: "タ",
	chi: "チ",
	tsu: "ツ",
	te: "テ",
	to: "ト",
} as const

const d = {
	da: "ダ",
	di: "ヂ",
	du: "ヅ",
	de: "デ",
	do: "ド",
} as const

const n = {
	na: "ナ",
	ni: "ニ",
	nu: "ヌ",
	ne: "ネ",
	no: "ノ",
	nn: "ン",
} as const

const h = {
	ha: "ハ",
	hi: "ヒ",
	hu: "フ",
	fu: "フ",
	he: "ヘ",
	ho: "ホ",
} as const

const b = {
	ba: "バ",
	bi: "ビ",
	bu: "ブ",
	be: "ベ",
	bo: "ボ",
} as const

const p = {
	pa: "パ",
	pi: "ピ",
	pu: "プ",
	pe: "ペ",
	po: "ポ",
} as const

const m = {
	ma: "マ",
	mi: "ミ",
	mu: "ム",
	me: "メ",
	mo: "モ",
} as const

const y = {
	ya: "ヤ",
	yu: "ユ",
	yo: "ヨ",
} as const

const r = {
	ra: "ラ",
	ri: "リ",
	ru: "ル",
	re: "レ",
	ro: "ロ",
} as const

const w = {
	wa: "ワ",
	wo: "ヲ",
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
	...v,
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
	kya: "キャ",
	kyu: "キュ",
	kyo: "キョ",
	sha: "シャ",
	shu: "シュ",
	sho: "ショ",
	cha: "チャ",
	chu: "チュ",
	cho: "チョ",
	nya: "ニャ",
	nyu: "ニュ",
	nyo: "ニョ",
	hya: "ヒャ",
	hyu: "ヒュ",
	hyo: "ヒョ",
	mya: "ミャ",
	myu: "ミュ",
	myo: "ミョ",
	rya: "リャ",
	ryu: "リュ",
	ryo: "リョ",
	fa: "ファ",
	fi: "フィ",
	fe: "フェ",
	fo: "フォ",
	wi: "ウィ",
	we: "ウェ",
	uxo: "ウォ",
	tsa: "ツァ",
	tsi: "ツィ",
	tse: "ツェ",
	tso: "ツォ",
	thi: "ティ",
	twu: "トゥ",
	she: "シェ",
	che: "チェ",
} as const

const comboDakuon = {
	gya: "ギャ",
	gyu: "ギュ",
	gyo: "ギョ",
	ja: "ジャ",
	ju: "ジュ",
	jo: "ジョ",
	dya: "ヂャ",
	dyu: "ヂュ",
	dyo: "ヂョ",
	bya: "ビャ",
	byu: "ビュ",
	byo: "ビョ",
	dhi: "ディ",
	dwu: "ドゥ",
	je: "ジェ",
} as const

const comboHandakuon = {
	pya: "ピャ",
	pyu: "ピュ",
	pyo: "ピョ",
} as const

const combo = {
	...comboBase,
	...comboDakuon,
	...comboHandakuon,
} as const

const doubleConsonants = {
	kka: "ッカ",
	kki: "ッキ",
	kku: "ック",
	kke: "ッケ",
	kko: "ッコ",

	ssa: "ッサ",
	sshi: "ッシ",
	ssu: "ッス",
	sse: "ッセ",
	sso: "ッソ",

	tta: "ッタ",
	cchi: "ッチ",
	ttsu: "ッツ",
	tte: "ッテ",
	tto: "ット",

	ppa: "ッパ",
	ppi: "ッピ",
	ppu: "ップ",
	ppe: "ッペ",
	ppo: "ッポ",
} as const

const katakana = {
	...base,
	...dakuon,
	...handakuon,
	...combo,
	...doubleConsonants,
	"-": "ー",
} as const

const romaji = Object.entries(katakana).reduce((acc, [roma, hira]) => {
	acc[hira] = roma
	return acc
}, {} as any)

export type Romaji = keyof typeof katakana
export type Katakana = (typeof katakana)[keyof typeof katakana]

const romajiToKatakanaPrefixTree = PrefixTree.fromRecord<Katakana>(katakana)
const katakanaToRomajiPrefixTree = PrefixTree.fromRecord<Romaji>(romaji)

function romajiToKatakana(romaji: string): string {
	let characters = romaji.split("")
	let output: string[] = []
	let start = 0
	let skipped = 0
	while (start < characters.length) {
		const longestPrefix = romajiToKatakanaPrefixTree.getLongestPrefix(characters, start)
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

function katakanaToRomaji(katakana: string): string {
	let characters = katakana.split("")
	let output: string[] = []
	let start = 0
	let skipped = 0
	while (start < characters.length) {
		const longestPrefix = katakanaToRomajiPrefixTree.getLongestPrefix(characters, start)
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
	v,
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
	katakana,
	romaji,
	prefixTree: {
		romajiToKatakana: romajiToKatakanaPrefixTree,
		katakanaToRomaji: katakanaToRomajiPrefixTree,
	} as const,
	fromRomaji: romajiToKatakana,
	toRomaji: katakanaToRomaji,
} as const
