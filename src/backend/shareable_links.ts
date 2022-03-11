import axios from 'axios'
import { capsuleServer } from './utilities/config'

export async function createShareableLink(cid: string) {
	const response = await axios.post(`${capsuleServer}/share`, { cid })
	return response.data.data as string
}
