import axios from 'axios'
import cache from './utilities/caching'
import ipfs from './utilities/ipfs'
import { capsuleOrbit } from './utilities/config'

export function preUploadPhoto(cid: string, photo: Blob) {
	const formData = new FormData()
	formData.append(`photo`, photo)
	formData.append(`cid`, cid)

	return axios.post(`${capsuleOrbit}/photos/upload`, formData)
}

export function addPhotoToIPFS(content: string | ArrayBuffer) {
	return ipfs().sendData(content)
}

function _getPhotoFromIPFS(cid: string) {
	return ipfs().getData(cid)
}

export const getPhotoFromIPFS = cache(_getPhotoFromIPFS)
