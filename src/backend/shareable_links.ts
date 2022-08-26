import axios from 'axios'
import { capsuleServer } from './utilities/config'

export async function createShareableLink(cid: string) {
	const response = await axios.post(`${capsuleServer}/share`, { cid })
	return response.data.data as string
}

export async function getShareableProfileLink(id: string) {
	const response = await axios.get(`${capsuleServer}/u/${id}/url`)
	return response.data.data as string
}
