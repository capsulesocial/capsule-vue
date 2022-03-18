import cache from './utilities/caching'
import ipfs from './utilities/ipfs'

function _getPhotoFromIPFS(cid: string) {
	return ipfs().getData(cid)
}

export const getPhotoFromIPFS = cache(_getPhotoFromIPFS)
