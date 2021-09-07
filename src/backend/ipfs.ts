import IPFS, { Options } from 'ipfs-core'
import { Post } from '~/interfaces/Post'
import { Profile } from '~/interfaces/Profile'

export interface IPFSInterface {
	sendProfile: (content: Profile) => Promise<string>
	getProfile: (hash: string) => Promise<Profile>
	sendPost: (content: Post) => Promise<string>
	getPost: (cid: string) => Promise<Post>
	sendPhoto: (content: any) => Promise<string>
	getPhoto: (cid: string) => Promise<any>
	importPrivateKey: (name: string, privateKey: string, password: string) => Promise<boolean>
	generatePrivateKey: (name: string) => Promise<boolean>
}

const ipfsConfig: Options = {
	init: { algorithm: `Ed25519` },
	preload: {
		enabled: true,
		addresses: [
			`/dns4/test-node.capsule.social/https`,
			`/dns4/node0.preload.ipfs.io/https`,
			`/dns4/node1.preload.ipfs.io/https`,
			`/dns4/node2.preload.ipfs.io/https`,
			`/dns4/node3.preload.ipfs.io/https`,
		],
	},
	config: {
		Bootstrap: [
			`/dns4/test-node.capsule.social/tcp/5434/wss/p2p/12D3KooWQzYjzbw7nghPMVP5z2ax29iDj2YsQ5GZDfnC4finSxnb`,
			`/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN`,
			`/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb`,
			`/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp`,
			`/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa`,
			`/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt`,
			`/dns4/node0.preload.ipfs.io/tcp/443/wss/p2p/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic`,
			`/dns4/node1.preload.ipfs.io/tcp/443/wss/p2p/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6`,
			`/dns4/node2.preload.ipfs.io/tcp/443/wss/p2p/QmV7gnbW5VTcJ3oyM2Xk1rdFBJ3kTkvxc87UFGsun29STS`,
			`/dns4/node3.preload.ipfs.io/tcp/443/wss/p2p/QmY7JB6MQXhxHvq7dBDh4HpbH29v4yE9JRadAVpndvzySN`,
		],
	},
}

async function createIPFSInterface(): Promise<IPFSInterface> {
	const node = await IPFS.create(ipfsConfig)

	// Send a user profile object to IPFS
	const sendProfile = async (content: Profile) => {
		const profileAdded = await node.add(JSON.stringify(content, null, 0))
		const cid = profileAdded.cid.toString()
		return cid
	}

	// Returns post object associated with content id
	const getProfile = async (cid: string) => {
		const content: Buffer[] = []
		for await (const chunk of node.cat(cid)) {
			content.push(Buffer.from(chunk))
		}
		const contentData = Buffer.concat(content)
		return JSON.parse(contentData.toString()) as Profile
	}

	// Send post to IPFS
	const sendPost = async (content: Post) => {
		const postAdded = await node.add(JSON.stringify(content, null, 0))
		const cid = postAdded.cid.toString()
		return cid
	}

	// Returns post object associated with content id
	const getPost = async (cid: string) => {
		const content: Buffer[] = []
		for await (const chunk of node.cat(cid)) {
			content.push(Buffer.from(chunk))
		}
		const contentData = Buffer.concat(content)
		return JSON.parse(contentData.toString()) as Post
	}

	// Add photo to IPFS
	const sendPhoto = async (content: any) => {
		const photoAdded = await node.add(content)
		const cid = photoAdded.cid.toString()
		return cid
	}

	// Get photo
	const getPhoto = async (cid: string) => {
		const content: Buffer[] = []
		for await (const chunk of node.cat(cid)) {
			content.push(Buffer.from(chunk))
		}
		const contentData = Buffer.concat(content)
		// eslint-disable-next-line consistent-return
		return contentData.toString()
	}

	// Import Private Key to local IPFS repo
	const importPrivateKey = async (name: string, privateKey: string, password: string) => {
		try {
			await node.key.import(name, privateKey, password)
			return true
		} catch (error: any) {
			if (error.code === `ERR_KEY_ALREADY_EXISTS`) {
				await node.key.rm(name)
				try {
					await node.key.import(name, privateKey, password)
					return true
				} catch {
					return false
				}
			}
		}
		return false
	}

	// Generate a new ed25519 key
	const generatePrivateKey = async (name: string) => {
		try {
			await node.key.gen(name, { type: `Ed25519` })
			return true
		} catch (error: any) {
			if (error.code === `ERR_KEY_ALREADY_EXISTS`) {
				await node.key.rm(name)
				await node.key.gen(name, { type: `Ed25519` })
				return true
			}
		}
		return false
	}

	return {
		sendProfile,
		getProfile,
		sendPost,
		getPost,
		sendPhoto,
		getPhoto,
		importPrivateKey,
		generatePrivateKey,
	}
}

let _ipfs: IPFSInterface | null = null

export async function initIPFS() {
	if (_ipfs) {
		return _ipfs
	}

	_ipfs = await createIPFSInterface()
	return _ipfs
}

function ipfs() {
	if (!_ipfs) {
		throw new Error(`IPFS isn't initiated!`)
	}
	return _ipfs
}

export default ipfs
