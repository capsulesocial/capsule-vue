import imageCompression from 'browser-image-compression'

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

export function isError(obj: Record<string, unknown>): obj is { error: any } {
	return `error` in obj
}

export function getBlobExtension(blob: Blob): string | null {
	switch (blob.type) {
		case `image/png`:
			return `.png`
		case `image/jpeg`:
			return `.jpeg`
		case `image/jpg`:
			return `.jpg`
		default:
			return null
	}
}

export function isValidFileType(fileType: string) {
	const validFileTypes = [`image/png`, `image/jpeg`, `image/jpg`]
	if (!validFileTypes.includes(fileType)) {
		return false
	}
	return true
}

export function getCompressedImage(file: File) {
	return imageCompression(file, {
		maxSizeMB: 5,
		maxWidthOrHeight: 1920,
		useWebWorker: true,
		initialQuality: 0.9,
	})
}
