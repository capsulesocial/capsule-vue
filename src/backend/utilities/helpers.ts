export interface ISignedIPFSObject<T> {
	data: T
	sig: string
	public_key: string
}

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

export function isValidFileType(fileType: string) {
	const validFileTypes = [`image/png`, `image/jpeg`, `image/jpg`, `image/avif`, `image/webp`]
	if (!validFileTypes.includes(fileType)) {
		return false
	}
	return true
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
