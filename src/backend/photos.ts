import cache from './utilities/caching'
import ipfs from './utilities/ipfs'

export function addPhotoToIPFS(content: string | ArrayBuffer) {
	return ipfs().sendData(content)
}

function _getPhotoFromIPFS(cid: string) {
	return ipfs().getData(cid)
}

const getPhotoFromIPFS = cache(_getPhotoFromIPFS)

export { getPhotoFromIPFS }
