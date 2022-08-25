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
const textLimits = {
	post_title: {
		min: 12,
		max: 90,
	},
	post_subtitle: {
		min: 12,
		max: 180,
	},
	post_content: {
		min: 400,
		max: 100000,
	},
	post_tag: {
		min: 1,
		max: 50,
	},
	post_images: {
		min: 0,
		max: 10,
	},
	username: {
		min: 3,
		max: 18,
	},
	profile_name: {
		min: 3,
		max: 32,
	},
	comment_content: {
		min: 1,
		max: 5000,
	},
	number_of_tags: {
		max: 3,
		min: 0, // not implemented
	},
	email: {
		min: 5,
		max: 200,
	},
	featuredPhotoCaption: {
		min: 5,
		max: 180,
	},
	bio: {
		min: 0,
		max: 5000,
	},
	location: {
		min: 0,
		max: 100,
	},
}

export default textLimits
