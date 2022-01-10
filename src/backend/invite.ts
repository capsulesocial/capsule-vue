import axios from 'axios'
import { capsuleServer } from './utilities/config'

export async function verifyCodeAndGetToken(inviteCode: string) {
	const response = await axios.post(`${capsuleServer}/invite/verify`, { code: inviteCode })
	return response.data.data as string
}

export async function verifyTokenAndOnboard(token: string, accountId: string) {
	const response = await axios.post(
		`${capsuleServer}/invite/verify/token`,
		{ accountId },
		{ headers: { Authorization: token } },
	)
	return response.data.data
}
