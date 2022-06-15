import axios from 'axios'
import { capsuleServer, sigValidity } from './utilities/config'
import { uint8ArrayToHexString } from './utilities/helpers'
import { signContent } from './utilities/keys'

export interface ICodesData {
	code: string
	exp: number
	used?: true
}

export async function generateInviteCode(inviter: string): Promise<{ inviteCode: string; invitesRemaining: number }> {
	const exp = Date.now() + sigValidity
	const { sig } = await signContent({ inviter, exp, action: `generateInvite` })

	const response = await axios.get(`${capsuleServer}/invite`, {
		params: { exp, sig: uint8ArrayToHexString(sig), inviter },
	})
	return response.data.data
}

export async function getInvitesRemaining(inviter: string): Promise<number> {
	const response = await axios.get(`${capsuleServer}/invite/remaining`, { params: { inviter } })
	return response.data.data
}

export async function getUserExistingInvites(inviter: string): Promise<ICodesData[]> {
	const exp = Date.now() + sigValidity
	const { sig } = await signContent({ inviter, exp, action: `existingInvites` })

	const response = await axios.get(`${capsuleServer}/invite/existing`, {
		params: { exp, sig: uint8ArrayToHexString(sig), inviter },
	})
	return response.data.data
}
