export interface IBackground {
	id: string
	type: string
	light: any
	dark: any
	label: string
}

export const backgrounds: IBackground[] = [
	{
		id: `default`,
		type: `local`,
		light: require(`@/assets/images/backgrounds/light/mainBG.webp`),
		dark: require(`@/assets/images/backgrounds/dark/mainBG.webp`),
		label: `Default`,
	},
	{
		id: `blogginLife`,
		type: `local`,
		light: require(`@/assets/images/backgrounds/light/blogn_life.webp`),
		dark: require(`@/assets/images/backgrounds/dark/blogn_life.webp`),
		label: `Bloggin' life`,
	},
	{
		id: `blueStroke`,
		type: `local`,
		light: require(`@/assets/images/backgrounds/light/blue_stroke.webp`),
		dark: require(`@/assets/images/backgrounds/light/blue_stroke.webp`),
		label: `Blue stroke`,
	},
	{
		id: `brainGuy`,
		type: `local`,
		light: require(`@/assets/images/backgrounds/light/brain_guy.webp`),
		dark: require(`@/assets/images/backgrounds/dark/brain_guy.webp`),
		label: `Brain guy`,
	},
	{
		id: `buoy`,
		type: `local`,
		light: require(`@/assets/images/backgrounds/light/buoy.webp`),
		dark: require(`@/assets/images/backgrounds/dark/buoy.webp`),
		label: `Buoy`,
	},
	{
		id: `greenStroke`,
		type: `local`,
		light: require(`@/assets/images/backgrounds/light/green_stroke.webp`),
		dark: require(`@/assets/images/backgrounds/light/green_stroke.webp`),
		label: `Green stroke`,
	},
	{
		id: `jelly`,
		type: `local`,
		light: require(`@/assets/images/backgrounds/light/jelly.webp`),
		dark: require(`@/assets/images/backgrounds/dark/jelly.webp`),
		label: `Jelly`,
	},
	{
		id: `neonPinkStroke`,
		type: `local`,
		light: require(`@/assets/images/backgrounds/light/neon_pink_stroke.webp`),
		dark: require(`@/assets/images/backgrounds/dark/neon_pink_stroke.webp`),
		label: `Neon pink stroke`,
	},
	{
		id: `neonStroke`,
		type: `local`,
		light: require(`@/assets/images/backgrounds/light/neon_stroke.webp`),
		dark: require(`@/assets/images/backgrounds/dark/neon_stroke.webp`),
		label: `Neon stroke`,
	},
	{
		id: `pinkStroke`,
		type: `local`,
		light: require(`@/assets/images/backgrounds/light/pink_stroke.webp`),
		dark: require(`@/assets/images/backgrounds/light/pink_stroke.webp`),
		label: `Pink stroke`,
	},
	{
		id: `sharkman`,
		type: `local`,
		light: require(`@/assets/images/backgrounds/light/sharkman.webp`),
		dark: require(`@/assets/images/backgrounds/dark/sharkman.webp`),
		label: `Sharkman`,
	},
	{
		id: `philosopher`,
		type: `Philosopher`,
		light: require(`@/assets/images/backgrounds/light/old_guy.webp`),
		dark: require(`@/assets/images/backgrounds/dark/old_guy.webp`),
		label: `Philosopher`,
	},
	{
		id: `textureText01`,
		type: `local`,
		light: require(`@/assets/images/backgrounds/light/texture-text01.webp`),
		dark: require(`@/assets/images/backgrounds/dark/texture-text01.webp`),
		label: `Texture text 01`,
	},
	{
		id: `urban01`,
		type: `local`,
		light: require(`@/assets/images/backgrounds/light/urbanstuff.webp`),
		dark: require(`@/assets/images/backgrounds/dark/urbanstuff.webp`),
		label: `Urban 01`,
	},
	{
		id: `urban02`,
		type: `local`,
		light: require(`@/assets/images/backgrounds/light/urbanstuff001.webp`),
		dark: require(`@/assets/images/backgrounds/dark/urbanstuff001.webp`),
		label: `Urban 02`,
	},
	{
		id: `greenMesh`,
		type: `local`,
		light: require(`@/assets/images/backgrounds/light/green.webp`),
		dark: require(`@/assets/images/backgrounds/dark/green.webp`),
		label: `Green Mesh`,
	},
	{
		id: `orangeMesh`,
		type: `local`,
		light: require(`@/assets/images/backgrounds/light/orange.webp`),
		dark: require(`@/assets/images/backgrounds/dark/orange.webp`),
		label: `Orange Mesh`,
	},
	{
		id: `blueMesh`,
		type: `local`,
		light: require(`@/assets/images/backgrounds/light/blue.webp`),
		dark: require(`@/assets/images/backgrounds/dark/blue.webp`),
		label: `Blue Mesh`,
	},
	{
		id: `pinkMesh`,
		type: `local`,
		light: require(`@/assets/images/backgrounds/light/pink.webp`),
		dark: require(`@/assets/images/backgrounds/dark/pink.webp`),
		label: `Pink Mesh`,
	},
	{
		id: `yellowMesh`,
		type: `local`,
		light: require(`@/assets/images/backgrounds/light/yellow.webp`),
		dark: require(`@/assets/images/backgrounds/dark/yellow.webp`),
		label: `Yellow Mesh`,
	},
]
