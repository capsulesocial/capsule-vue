import axios from 'axios'
import { capsuleServer } from './utilities/config'

export async function revokeDiscordKey(token: string) {
	const response = await axios.post(`${capsuleServer}/discord`, { token })
	return response.data.data as string
}
