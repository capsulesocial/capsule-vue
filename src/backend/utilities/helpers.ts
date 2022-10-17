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
