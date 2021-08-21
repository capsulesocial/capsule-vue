export const state = () => ({
	feelings: {
		positive: [`awe`, `excited`, `happy`, `lol`, `proud`, `touched`],
		negative: [`sad`, `sick`, `terrified`, `skeptical`, `drama`],
		neutral: [`goofy`],
	},
	reactions: {
		awe: {
			label: `Awe`,
			image: require(`@/assets/images/reactions/awe.png`),
			background: require(`@/assets/images/backgrounds/agree.png`),
		},
		bored: {
			label: `Bored`,
			image: require(`@/assets/images/reactions/bored.png`),
			background: require(`@/assets/images/backgrounds/disagree.png`),
		},
		drama: {
			label: `Dramatic`,
			image: require(`@/assets/images/reactions/drama.png`),
			background: require(`@/assets/images/backgrounds/neutral.png`),
		},
		excited: {
			label: `Excited`,
			image: require(`@/assets/images/reactions/excited.png`),
			background: require(`@/assets/images/backgrounds/agree.png`),
		},
		goofy: {
			label: `Goofy`,
			image: require(`@/assets/images/reactions/goofy.png`),
			background: require(`@/assets/images/backgrounds/neutral.png`),
		},
		happy: {
			label: `Happy`,
			image: require(`@/assets/images/reactions/happy.png`),
			background: require(`@/assets/images/backgrounds/agree.png`),
		},
		lol: {
			label: `Lol`,
			image: require(`@/assets/images/reactions/lol.png`),
			background: require(`@/assets/images/backgrounds/agree.png`),
		},
		skeptical: {
			label: `Skeptical`,
			image: require(`@/assets/images/reactions/not-buyin-it.png`),
			background: require(`@/assets/images/backgrounds/disagree.png`),
		},
		proud: {
			label: `Proud`,
			image: require(`@/assets/images/reactions/proud.png`),
			background: require(`@/assets/images/backgrounds/agree.png`),
		},
		sad: {
			label: `Sad`,
			image: require(`@/assets/images/reactions/sad.png`),
			background: require(`@/assets/images/backgrounds/disagree.png`),
		},
		satisfied: {
			label: `Satisfied`,
			image: require(`@/assets/images/reactions/satisfied.png`),
			background: require(`@/assets/images/backgrounds/agree.png`),
		},
		sick: {
			label: `Sick`,
			image: require(`@/assets/images/reactions/sick.png`),
			background: require(`@/assets/images/backgrounds/disagree.png`),
		},
		terrified: {
			label: `Terrified`,
			image: require(`@/assets/images/reactions/terrified.png`),
			background: require(`@/assets/images/backgrounds/disagree.png`),
		},
		touched: {
			label: `Touched`,
			image: require(`@/assets/images/reactions/touched.png`),
			background: require(`@/assets/images/backgrounds/agree.png`),
		},
	},
	backgrounds: {
		positive: require(`@/assets/images/backgrounds/agree.png`),
		negative: require(`@/assets/images/backgrounds/disagree.png`),
		neutral: require(`@/assets/images/backgrounds/neutral.png`),
		default: require(`@/assets/images/backgrounds/paper.png`),
	},
	categories: [
		`technology`,
		`crypto`,
		`politics`,
		`US-world`,
		`science`,
		`environment`,
		`food & drink`,
		`culture`,
		`education`,
		`philosophy`,
		`news`,
		`sports`,
	],
})
