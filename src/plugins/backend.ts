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
import { Plugin } from '@nuxt/types'
import { initIPFS } from '@capsulesocial/ipfs-wrapper'
import { initLibSodium } from '@/backend/utilities/keys'
import { initContract, initNear, initWalletConnection } from '@/backend/near'
import { nearNetwork, bootstrapNodes } from '@/backend/utilities/config'

const backend: Plugin = async (context) => {
	try {
		// If the user has refreshed or backtracked etc
		// eslint-disable-next-line no-unmodified-loop-condition
		for (let i = 0; i < localStorage.length && nearNetwork === `mainnet`; i++) {
			const key = localStorage.key(i)
			if (key && key.startsWith(`near-api-js:keystore`)) {
				if (key.endsWith(`testnet`)) {
					const privateKey = localStorage.getItem(key)
					if (privateKey) {
						localStorage.setItem(key.replace(`testnet`, `mainnet`), privateKey)
					}
				}
			}
		}
		await initNear()
		const libsodium = initLibSodium()
		libsodium.initResult.catch((err: unknown) => {
			if (err instanceof Error) {
				context.$toastError(err.message)
			}

			throw err
		})
		const ipfs = initIPFS(bootstrapNodes)
		ipfs.initResult.catch((err: unknown) => {
			if (err instanceof Error) {
				context.$toastError(err.message)
			}

			throw err
		})
		initWalletConnection()

		const accountId = window.localStorage.getItem(`accountId`)
		if (accountId) {
			initContract(accountId)
			return
		}

		initContract(``)
	} catch (err: unknown) {
		if (err instanceof Error) {
			context.$toastError(err.message)
		}

		throw err
	}
}

export default backend
