import axios from 'axios'
import { capsuleServer } from './utilities/config'

export async function verifyCodeAndGetToken(inviteCode: string) {
	const response = await axios.post(`${capsuleServer}/invite/verify`, { code: inviteCode })
	const token: string = response.data.data
	setToken(token)
}

export async function verifyTokenAndOnboard(accountId: string) {
	const token = getToken()
	if (!token) {
		throw new Error(`Invite token not found`)
	}
	const response = await axios.post(
		`${capsuleServer}/invite/verify/token`,
		{ accountId },
		{ headers: { Authorization: `Bearer ${token}` } },
	)
	removeToken()
	return response.data.data as string
}

function setToken(token: string) {
	window.localStorage.setItem(`inviteToken`, token)
}

function getToken() {
	return window.localStorage.getItem(`inviteToken`)
}

function removeToken() {
	window.localStorage.removeItem(`inviteToken`)
}
