import ipfs from './utilities/ipfs'

export function addPhotoToIPFS(content: string | ArrayBuffer) {
	return ipfs().sendData(content)
}

export function getPhotoFromIPFS(cid: string) {
	return ipfs().getData(cid)
}
