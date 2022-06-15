import axios from 'axios'
import { checkAccountStatus, getIsAccountIdOnboarded } from './near'
import { capsuleServer, sufficientFunds } from './utilities/config'

export async function requestOTP(phoneNumber: string) {
	const response = await axios.post(`${capsuleServer}/sendOtp`, {
		phoneNumber,
	})
	return response.data.data
}

export async function getFundTransferStatus(accountId: string): Promise<`PROCESSING` | `SENT` | `FAILED`> {
	const response = await axios.get(`${capsuleServer}/onboard/sponsor/status?accountId=${accountId}`)
	return response.data.data
}

export function hasSufficientFunds(currentFunds: string) {
	return BigInt(currentFunds) >= BigInt(sufficientFunds)
}

export function waitForFunds(accountId: string) {
	let secWaited = 0
	return new Promise<{ balance: string }>((resolve, reject) => {
		const waiter = async () => {
			const [{ balance }, onboarded] = await Promise.all([
				checkAccountStatus(accountId),
				getIsAccountIdOnboarded(accountId),
			])
			if (hasSufficientFunds(balance) && onboarded) {
				resolve({ balance })
				return
			}
			if (secWaited > 30) {
				const status = await getFundTransferStatus(accountId)
				switch (status) {
					case `FAILED`:
						reject(new Error(`Failed to transfer funds`))
						return
					case `SENT`:
						secWaited = 0
						break
					case `PROCESSING`:
						secWaited = 0
						break
					default:
						reject(new Error(`Unknown status: ${status}`))
						return
				}
			}
			secWaited = secWaited + 1
			setTimeout(waiter, 1000)
		}

		waiter()
	})
}

export async function requestOnboard(phoneNumber: string, code: string, accountId: string) {
	const response = await axios.post(`${capsuleServer}/onboard`, {
		phoneNumber,
		code,
		accountId,
	})
	return response.data.data
}
