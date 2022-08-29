/*
 * Copyright (c) 2021-2022 Capsule Social, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */
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
