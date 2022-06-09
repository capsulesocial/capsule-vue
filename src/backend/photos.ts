import axios from 'axios'
import ipfs from './utilities/ipfs'
import { nodeUrl, sigValidity } from './utilities/config'
import { signContent } from './utilities/keys'
import { uint8ArrayToHexString } from './utilities/helpers'
import { getCompressedImage } from './utilities/imageCompression'
import { encryptData } from './crypto'

interface IUploadPhotoResult {
	cid: string
	url: string | ArrayBuffer
	image: File
	imageName: string
}

interface IUploadEncryptedPhotoResult extends IUploadPhotoResult {
	key: string
	counter: string
}

export async function preUploadPhoto(cid: string, photo: Blob, filename: string, authorID: string, encrypted = false) {
	const exp = (Date.now() + sigValidity).toString()
	const { sig } = await signContent({ cid, exp, authorID })

	const formData = new FormData()
	formData.append(`cid`, cid)
	formData.append(`exp`, exp)
	formData.append(`authorID`, authorID)
	formData.append(`sig`, uint8ArrayToHexString(sig))

	if (encrypted) {
		formData.append(`encrypted`, `true`)
	}

	// For multer to behave correctly on the server, the file should be the last thing appended on the formData.
	formData.append(`photo`, photo, filename)
	return axios.post(`${nodeUrl()}/photos/upload`, formData)
}

export function addPhotoToIPFS(content: string | ArrayBuffer) {
	return ipfs().sendData(content)
}

interface IBasicImageResult {
	data: string | ArrayBuffer
}

interface IEncryptImageResult extends IBasicImageResult {
	data: string
	image: File
	key: string
	counter: string
}

async function encryptImage(rawData: string | ArrayBuffer, imageName: string): Promise<IEncryptImageResult> {
	const { data, key, counter } = await encryptData(rawData.toString())
	const image = new File([data], imageName)
	return { data, image, key, counter }
}

export function uploadPhoto(file: File, encrypt: true): Promise<IUploadEncryptedPhotoResult>
export function uploadPhoto(file: File): Promise<IUploadPhotoResult>
export function uploadPhoto(file: File, encrypt?: true) {
	return new Promise<IUploadPhotoResult | IUploadEncryptedPhotoResult>((resolve, reject) => {
		try {
			getCompressedImage(file)
				.then((compressedImage) => {
					const reader = new FileReader()
					reader.readAsDataURL(compressedImage)
					reader.onload = async (i) => {
						if (i.target !== null && i.target.result !== null) {
							let results: IEncryptImageResult | IBasicImageResult = {
								data: i.target.result,
							}
							if (encrypt) {
								results = await encryptImage(results.data, file.name)
							}
							const cid = await addPhotoToIPFS(results.data)
							resolve({
								cid,
								url: i.target.result,
								image: compressedImage,
								imageName: file.name,
								...results,
							})
						}
					}
					reader.onerror = (_ev) => {
						throw new Error(`Something went wrong while loading the image`)
					}
				})
				.catch((err) => {
					reject(err)
				})
		} catch (err) {
			reject(err)
		}
	})
}
