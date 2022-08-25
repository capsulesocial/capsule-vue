/*
 * Copyright (c) 2021-2022 Capsule Social, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */
import axios from 'axios'
import { checkAccountStatus, getIsAccountIdOnboarded } from './near'
import { capsuleServer, sufficientFunds } from './utilities/config'

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

export async function requestOnboard(captchaRes: string, accountId: string) {
	const response = await axios.post(`${capsuleServer}/onboard`, {
		captchaRes,
		accountId,
	})
	return response.data.data
}
