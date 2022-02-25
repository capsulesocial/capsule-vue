import axios from 'axios'
import { capsuleServer, sigValidity } from './utilities/config'
import { uint8ArrayToHexString } from './utilities/helpers'
import { signContent } from './utilities/keys'

export interface ISubscriptionEvent {
	action: `SUBSCRIBE` | `UNSUBSCRIBE`
	subject: string
	object: string
	exp: number
}

export async function subscriptionChange(action: `SUBSCRIBE` | `UNSUBSCRIBE`, self: string, user: string) {
	const data: ISubscriptionEvent = {
		action,
		subject: self,
		object: user,
		exp: Date.now() + sigValidity,
	}

	const { sig } = await signContent(data)

	await axios.post(`${capsuleServer}/subscription/subscribe`, {
		event: data,
		sig: uint8ArrayToHexString(sig),
	})
}
