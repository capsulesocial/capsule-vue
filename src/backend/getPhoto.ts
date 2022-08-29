/*
 * Copyright (c) 2021-2022 Capsule Social, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */
import ipfs from '@capsulesocial/ipfs-wrapper'
import cache from './utilities/caching'
import { validFileTypes } from './utilities/helpers'

function _getPhotoFromIPFS(cid: string) {
	return ipfs().getData(cid)
}

export function isValidPhoto(content: string) {
	const regExp = new RegExp(`^data:image/(?:${validFileTypes.join(`|`)});base64,([a-zA-Z0-9+/]+=*)$`)
	return regExp.test(content)
}

export const getPhotoFromIPFS = cache(_getPhotoFromIPFS)
