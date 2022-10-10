export type InsertContent = string | { cid: string; url: string | ArrayBuffer }

export function getContentImages(content: string) {
	const domParser = new DOMParser()
	const htmlDoc = domParser.parseFromString(content, `text/html`)

	return htmlDoc.getElementsByTagName(`img`)
}

export function getBlobExtension(blob: Blob) {
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

export function isError(obj: Record<string, unknown>): obj is { error: string } {
	return `error` in obj
}
