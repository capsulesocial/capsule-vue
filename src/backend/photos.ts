import axios from 'axios'
import cache from './utilities/caching'
import ipfs from './utilities/ipfs'
import { nodeUrl, sigValidity } from './utilities/config'
import { signContent } from './utilities/keys'
import { uint8ArrayToHexString } from './utilities/helpers'

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

function _getPhotoFromIPFS(cid: string) {
	return ipfs().getData(cid)
}

export const getPhotoFromIPFS = cache(_getPhotoFromIPFS)
