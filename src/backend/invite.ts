import axios from 'axios'
import { capsuleServer, sigValidity } from './utilities/config'
import { uint8ArrayToHexString } from './utilities/helpers'
import { signContent } from './utilities/keys'

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

export async function generateInviteCode(inviter: string): Promise<{ inviteCode: string; invitesRemaining: number }> {
	const exp = Date.now() + sigValidity
	const signature = await signContent({ inviter, exp })
	if (!signature) {
		throw new Error(`Object signing failed`)
	}
	const sig = uint8ArrayToHexString(signature)
	const response = await axios.get(`${capsuleServer}/invite`, { params: { exp, sig, inviter } })
	return response.data.data
}

export async function getInvitesRemaining(inviter: string): Promise<number> {
	const response = await axios.get(`${capsuleServer}/invite/remaining`, { params: { inviter } })
	return response.data.data
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