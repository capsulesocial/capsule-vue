import axios from 'axios'
import { capsuleServer } from './utilities/config'

export async function requestOTP(phoneNumber: string) {
	const response = await axios.post(`${capsuleServer}/sendOtp`, {
		phoneNumber,
	})
	return response.data.data
}

export async function requestSponsor(phoneNumber: string, code: string, accountId: string) {
	const response = await axios.post(`${capsuleServer}/sponsor`, {
		phoneNumber,
		code,
		accountId,
	})
	return response.data.data
}
