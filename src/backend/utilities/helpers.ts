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
export interface ISignedIPFSObject<T> {
	data: T
	sig: string
	public_key: string
}

export const validFileTypes = [`png`, `jpeg`, `jpg`, `avif`, `webp`]
export const validMimeTypes = validFileTypes.map((t) => `image/${t}`)

export function uint8ArrayToHexString(uint8Array: Uint8Array): string {
	return Buffer.from(uint8Array).toString(`hex`)
}

export function hexStringToUint8Array(hexString: string): Uint8Array {
	return new Uint8Array(Buffer.from(hexString, `hex`))
}

export function stableOrderObj<T extends Record<string, any>>(obj: T): T {
	const keys = Object.keys(obj)
	keys.sort()

	const newObj: any = {}
	for (const key of keys) {
		newObj[key] = obj[key]
	}

	return newObj as T
}

export function getBlobExtension(blob: Blob): string | null {
	switch (blob.type) {
		case `image/png`:
			return `.png`
		case `image/jpeg`:
			return `.jpeg`
		case `image/jpg`:
			return `.jpg`
		case `image/avif`:
			return `.avif`
		case `image/webp`:
			return `.webp`
		default:
			return null
	}
}

export function calculateReadingTime(wordCount?: number, postImagesLength: number = 0) {
	if (!wordCount) {
		return null
	}
	const textReadingTime = wordCount / 275
	const photoReadingTime = (postImagesLength * ((12 * 100) / 60)) / 100
	const readingTime = Math.round(((textReadingTime + photoReadingTime) * 60) / 100)
	return readingTime < 1 ? 1 : readingTime
}

export function getExpTimestamp() {
	return Date.now() + 5 * 60 * 1000
}
