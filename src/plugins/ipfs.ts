import type { Plugin } from '@nuxt/types'
import { Post } from '~/interfaces/Post'
import { Profile } from '~/interfaces/Profile'
const IPFS = require(`ipfs`)

// eslint-disable-next-line quotes
declare module 'vue/types/vue' {
  interface Vue {
    $sendProfile: (content: Profile) => Promise<string>,
    $getProfile: (cid: string) => Promise<Profile>,
    $sendPost: (content: Post) => Promise<string>,
    $getPost: (cid: string) => Promise<Post>,
    $getPhoto: (cid: string) => Promise<any>,
    $sendPhoto: (content: any) => Promise<string>,
  }
}

const ipfsPlugin: Plugin = async (_context, inject) => {
	const node = await IPFS.create()
	const version = await node.version()

	// eslint-disable-next-line no-console
	console.log(`IPFS version: `, version.version)

	const getNodePrivateKey: (() => Promise<string>) = async () => {
		const privateKey = await node.key.export(`self`, `password`)
		return privateKey
	}

	const getNodePublicKey: (() => Promise<string>) = async () => {
		const publicKey = await node.id()
		return publicKey
	}
	// Send a user profile object to IPFS
	const sendProfile: ((content: Profile) => Promise<string>) = async (content) => {
		const profileAdded = await node.add({
			path: content.id,
			content: JSON.stringify(content),
		})
		const cid = profileAdded.cid.string
		return cid
	}

	// Returns post object associated with content id
	const getProfile: ((cid: string) => Promise<Profile>) = async (cid) => {
		let content: string = ``
		for await (const chunk of node.cat(cid)) {
			content += chunk.toString()
		}
		return JSON.parse(content)
	}

	// Send post to IPFS
	const sendPost: ((content: Post) => Promise<string>) = async (content: Post) => {
		const postAdded = await node.add({
			path: content.title,
			content: JSON.stringify(content),
		})
		const cid = postAdded.cid.string
		return cid
	}

	// Returns post object associated with content id
	const getPost: ((cid: string) => Promise<Post>) = async (cid) => {
		let content: string = ``
		for await (const chunk of node.cat(cid)) {
			content += chunk.toString()
		}
		return JSON.parse(content)
	}

	// Add photo to IPFS
	const sendPhoto: ((content: any) => Promise<string>) = async (content) => {
		const photoAdded = await node.add(content)
		const cid = photoAdded.cid.string
		return cid
	}

	// Get photo
	const getPhoto: ((cid: string) => Promise<any>) = async (cid) => {
		if (cid === null || cid === ``) {
			return
		}
		let content: string = ``
		for await (const chunk of node.cat(cid)) {
			content += chunk.toString()
		}
		// eslint-disable-next-line consistent-return
		return content
	}

	inject(`getNodePrivateKey`, getNodePrivateKey)
	inject(`getNodePublicKey`, getNodePublicKey)
	inject(`sendProfile`, sendProfile)
	inject(`sendPost`, sendPost)
	inject(`getPost`, getPost)
	inject(`sendPhoto`, sendPhoto)
	inject(`getPhoto`, getPhoto)
	inject(`getProfile`, getProfile)
}

export default ipfsPlugin
