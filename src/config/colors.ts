export interface IMode {
	image: unknown
	label: `Light` | `Dark` | `OS`
}

export const modes: Array<IMode> = [
	{
		image: require(`@/assets/images/colors/light.webp`),
		label: `Light`,
	},
	{
		image: require(`@/assets/images/colors/dark.webp`),
		label: `Dark`,
	},
	{
		image: require(`@/assets/images/colors/OS.webp`),
		label: `OS`,
	},
]

export interface IColor {
	id: string
	hex: string
}

export const colors: Array<IColor> = [
	{
		id: `Green`,
		hex: `#7097ac`,
	},
	{
		id: `Orange`,
		hex: `#ff4747`,
	},
	{
		id: `Blue`,
		hex: `#396bf8`,
	},
	{
		id: `Pink`,
		hex: `#eb3d7c`,
	},
	{
		id: `Yellow`,
		hex: `#ffcc33`,
	},
]
