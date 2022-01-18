import axios from 'axios'
import { checkAccountStatus } from './near'
import { capsuleServer, sufficientFunds } from './utilities/config'

export async function requestOTP(phoneNumber: string) {
	const response = await axios.post(`${capsuleServer}/sendOtp`, {
		phoneNumber,
	})
	return response.data.data
}

export async function getFundTransferStatus(accountId: string) {
	const response = await axios.get(`${capsuleServer}/status?accountId=${accountId}`)
	return response.data.data
}

export function hasSufficientFunds(currentFunds: string) {
	return BigInt(currentFunds) >= BigInt(sufficientFunds)
}

export function waitForFunds(accountId: string) {
	let secWaited = 0
	return new Promise<{ balance?: string; error?: string }>((resolve) => {
		const waiter = async () => {
			const { balance } = await checkAccountStatus(accountId)
			if (hasSufficientFunds(balance)) {
				resolve({ balance })
				return
			}
			if (secWaited > 30) {
				const status: `PROCESSING` | `SENT` | `FAILED` = await getFundTransferStatus(accountId)
				switch (status) {
					case `FAILED`:
						resolve({ error: `Failed to transfer funds` })
						return
					case `SENT`:
						secWaited = 0
						break
					case `PROCESSING`:
						secWaited = 0
						break
					default:
						resolve({ error: `Unknown status: ${status}` })
						return
				}
			}
			secWaited = secWaited + 1
			setInterval(waiter, 1000)
		}

		waiter()
	})
}

export async function requestSponsor(phoneNumber: string, code: string, accountId: string) {
	const response = await axios.post(`${capsuleServer}/sponsor`, {
		phoneNumber,
		code,
		accountId,
	})
	return response.data.data
}
