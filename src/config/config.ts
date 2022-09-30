export type EmotionCategories = `positive` | `negative` | `neutral`

export type Emotions =
	| `curious`
	| `informed`
	| `enlighten`
	| `glad`
	| `happy`
	| `excited`
	| `confident`
	| `brave`
	| `fearless`
	| `enthusiastic`
	| `lol`
	| `guffaw`
	| `intrigued`
	| `interested`
	| `committed`
	| `proud`
	| `admiration`
	| `awe`
	| `determined`
	| `defiant`
	| `on_it`
	| `distracted`
	| `bored`
	| `spiritless`
	| `triggered`
	| `shocked`
	| `furious`
	| `disgusted`
	| `sick`
	| `revolted`
	| `suspicious`
	| `incredulous`
	| `skeptical`
	| `hesitant`
	| `fearful`
	| `terrified`
	| `aloof`
	| `indifferent`
	| `detached`
	| `sad`
	| `whine`
	| `heartbroken`
	| `cringe`
	| `offended`
	| `hateful`
	| `empathy`
	| `friendly`
	| `lovely`
	| `calm`
	| `satisfied`
	| `fulfilled`
	| `mad`
	| `hostile`
	| `violent`
	| `hush`
	| `wild`
	| `zzz`
	| `regret`
	| `spunky`
	| `trippy`
	| `no-emotion`

const positiveEmotions: Array<Emotions> = [
	`curious`,
	`informed`,
	`enlighten`,
	`glad`,
	`happy`,
	`excited`,
	`confident`,
	`brave`,
	`fearless`,
	`enthusiastic`,
	`lol`,
	`guffaw`,
	`intrigued`,
	`interested`,
	`committed`,
	`proud`,
	`admiration`,
	`awe`,
	`determined`,
	`defiant`,
	`on_it`,
]

const negativeEmotions: Array<Emotions> = [
	`distracted`,
	`bored`,
	`spiritless`,
	`triggered`,
	`shocked`,
	`furious`,
	`disgusted`,
	`sick`,
	`revolted`,
	`suspicious`,
	`incredulous`,
	`skeptical`,
	`hesitant`,
	`fearful`,
	`terrified`,
	`aloof`,
	`indifferent`,
	`detached`,
	`sad`,
	`whine`,
	`heartbroken`,
	`cringe`,
	`offended`,
	`hateful`,
]

const neutralEmotions: Array<Emotions> = [
	`empathy`,
	`friendly`,
	`lovely`,
	`calm`,
	`satisfied`,
	`fulfilled`,
	`mad`,
	`hostile`,
	`violent`,
	`hush`,
	`wild`,
	`zzz`,
	`regret`,
	`spunky`,
	`trippy`,
]

export const emotionCategories: Record<EmotionCategories, Set<Emotions>> = {
	positive: new Set(positiveEmotions),
	negative: new Set(negativeEmotions),
	neutral: new Set(neutralEmotions),
}

export const categories = [
	`technology`,
	`crypto`,
	`politics`,
	`US-world`,
	`science`,
	`environment`,
	`food-drink`,
	`culture`,
	`education`,
	`philosophy`,
	`news`,
	`sports`,
	`economics`,
	`photography`,
	`history`,
	`social-justice`,
	`short-stories`,
	`others`,
]
