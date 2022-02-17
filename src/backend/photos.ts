import axios from 'axios'
import cache from './utilities/caching'
import ipfs from './utilities/ipfs'
import { nodeUrl, sigValidity } from './utilities/config'
import { signContent } from './utilities/keys'
import { getCompressedImage, uint8ArrayToHexString } from './utilities/helpers'

interface IUploadPhotoResult {
	cid: string
	url: string | ArrayBuffer
	image: File
	imageName: string
}

export async function preUploadPhoto(cid: string, photo: Blob, filename: string, authorID: string) {
	const exp = (Date.now() + sigValidity).toString()
	const signature = await signContent({ cid, exp, authorID })
	if (!signature) {
		throw new Error(`Post signing failed`)
	}

	const formData = new FormData()
	formData.append(`photo`, photo, filename)
	formData.append(`cid`, cid)
	formData.append(`exp`, exp)
	formData.append(`authorID`, authorID)
	formData.append(`sig`, uint8ArrayToHexString(signature))

	return axios.post(`${nodeUrl()}/photos/upload`, formData)
}

export function addPhotoToIPFS(content: string | ArrayBuffer) {
	return ipfs().sendData(content)
}

export function uploadPhoto(image: File) {
	return new Promise<IUploadPhotoResult>((resolve, reject) => {
		try {
			getCompressedImage(image)
				.then((compressedImage) => {
					const reader = new FileReader()
					reader.readAsDataURL(compressedImage)
					reader.onload = async (i) => {
						if (i.target !== null && i.target.result !== null) {
							const cid = await addPhotoToIPFS(i.target.result)
							resolve({ cid, url: i.target.result, image: compressedImage, imageName: image.name })
						}
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

function _getPhotoFromIPFS(cid: string) {
	return ipfs().getData(cid)
}

export const getPhotoFromIPFS = cache(_getPhotoFromIPFS)
