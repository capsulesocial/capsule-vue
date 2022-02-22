import imageCompression from 'browser-image-compression'

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

export function getCompressedImage(file: File) {
	return imageCompression(file, {
		maxSizeMB: 5,
		maxWidthOrHeight: 1920,
		useWebWorker: true,
		initialQuality: 0.9,
	})
}

function parseJwt(token: string) {
	const base64Url = token.split(`.`)[1]
	const base64 = base64Url.replace(/-/g, `+`).replace(/_/g, `/`)
	const jsonPayload = decodeURIComponent(
		Buffer.from(base64, `base64`)
			.toString()
			.split(``)
			.map((c) => `%` + (`00` + c.charCodeAt(0).toString(16)).slice(-2))
			.join(``),
	)

	return JSON.parse(jsonPayload)
}

export interface IInviteTokenData {
	code: string
	iat: number
	exp: number
}

export function getInviteToken(): string | null {
	const inviteToken = window.localStorage.getItem(`inviteToken`)
	if (!inviteToken) {
		return null
	}

	try {
		const parsedToken: IInviteTokenData = parseJwt(inviteToken)
		if (parsedToken.exp < Date.now() / 1000) {
			window.localStorage.removeItem(`inviteToken`)
			return null
		}

		return inviteToken
	} catch {
		window.localStorage.removeItem(`inviteToken`)
		return null
	}
}
