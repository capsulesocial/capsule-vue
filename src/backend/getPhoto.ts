import cache from './utilities/caching'
import { validFileTypes } from './utilities/helpers'
import ipfs from './utilities/ipfs'

function _getPhotoFromIPFS(cid: string) {
	return ipfs().getData(cid)
}

export function isValidPhoto(content: string) {
	const regExp = new RegExp(`^data:image/(?:${validFileTypes.join(`|`)});base64,([a-zA-Z0-9+/]+=*)$`)
	return regExp.test(content)
}

export const getPhotoFromIPFS = cache(_getPhotoFromIPFS)
