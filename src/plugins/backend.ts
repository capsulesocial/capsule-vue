import { Plugin } from '@nuxt/types'
import { initIPFS } from '@/backend/utilities/ipfs'
import { initContract } from '@/backend/near'

const backend: Plugin = async (_context) => {
	await initIPFS()
	const accountId = window.localStorage.getItem(`accountId`)
	if (accountId) {
		await initContract(accountId)
	}
}

export default backend
