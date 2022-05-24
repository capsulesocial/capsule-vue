import { create, Options, CID } from 'ipfs-core'
import { bootstrapNodes } from './config'

export interface IPFSInterface {
	sendData: (content: string | ArrayBuffer) => Promise<string>
	getData: (cid: string) => Promise<string>
	getJSONData: <T>(hash: string) => Promise<T>
	sendJSONData: <T>(content: T) => Promise<string>
	getNodes: () => Promise<number>
	initResult: Promise<void>
}

const ipfsConfig: Options = {
	start: false,
	libp2p: {
		peerStore: { persistence: false },
	},
	init: { algorithm: `Ed25519` },
	preload: {
		enabled: false,
	},
	config: {
		Bootstrap: bootstrapNodes,
	},
}

/**
 * An IPFS interface is created, but the node doesn't start right away. Generally we observed that the node starting procedure is slow and blocks the loading of the whole app.
 * Hence, we made the loading of the node async and we basically keep a cache of all the requests to IPFS while the node is initialising to dispatch them after the fact.
 */
async function createIPFSInterface(): Promise<IPFSInterface> {
	let ipfsInitialised = false
	const node = await create(ipfsConfig)

	const promiseCache: Array<{
		func: (...args: any[]) => Promise<any>
		args: any[]
		resolver: (value: any) => void
	}> = []

	function _resolveCachedPromises() {
		for (const v of promiseCache) {
			const { resolver, func, args } = v
			resolver(func(...args))
		}

		// Clear the array
		promiseCache.splice(0, promiseCache.length)
	}

	function _promiseWrapper<T>(func: (...funcArgs: any[]) => Promise<T>, ...args: any[]) {
		if (ipfsInitialised) {
			return func(...args)
		}

		let resolver: (value: T) => void = () => null
		const promise = new Promise<T>((resolve) => {
			resolver = resolve
		})

		promiseCache.push({ func, args, resolver })

		return promise
	}

	function _maintainConnection() {
		setTimeout(async () => {
			await ensureConnectedToBootstrapNodes()
			_maintainConnection()
		}, 10000)
	}

	async function ensureConnectedToBootstrapNodes() {
		// get a list of all addresses for all of the peers we're currently connected to
		const peerAddrs = new Set<string>()
		try {
			const swarmAddrs = await node.swarm.addrs({ timeout: 5000 })
			swarmAddrs.forEach((p) => p.addrs.forEach((a) => peerAddrs.add(a.toString())))
		} catch (err) {
			// eslint-disable-next-line no-console
			console.log(`Failed to get IPFS swarm addreses: ${err}`)
			return
		}

		// get a list of boostrap nodes that we're not currently connected to, and try connecting to them
		const disconnectedBootstrapNodes = bootstrapNodes.filter((bootstrapNode: string) => !peerAddrs.has(bootstrapNode))
		for (const a of disconnectedBootstrapNodes) {
			try {
				await node.swarm.connect(a)
			} catch (err) {
				// eslint-disable-next-line no-console
				console.error(`Failed to connect to ${a}: ${err}`)
			}
		}
	}

	const getData = async (cid: string) => {
		const content: Buffer[] = []
		for await (const chunk of node.cat(cid)) {
			content.push(Buffer.from(chunk))
		}
		return Buffer.concat(content).toString()
	}

	const getJSONData = async <T>(cid: string) => {
		const res = await node.dag.get(CID.parse(cid))
		if (!res.value) {
			throw new Error(`No data found!`)
		}
		return res.value as T
	}

	const sendData = async (content: string | ArrayBuffer) => {
		const { cid } = await node.add(content)
		return cid.toString()
	}

	const sendJSONData = async <T>(content: T) => {
		const cid = await node.dag.put(content, {
			storeCodec: `dag-cbor`,
			hashAlg: `sha2-256`,
		})

		return cid.toString()
	}

	const getNodes = async () => {
		const peers = await node.swarm.peers()
		return peers.length
	}

	const initResult = node.start().then(() => {
		ipfsInitialised = true
		_maintainConnection()
		_resolveCachedPromises()
	})

	return {
		getJSONData: <T>(cid: string) => _promiseWrapper<T>(getJSONData, cid),
		sendJSONData: <T>(content: T) => _promiseWrapper<string>(sendJSONData, content),
		sendData: (content: string | ArrayBuffer) => _promiseWrapper(sendData, content),
		getData: (cid: string) => _promiseWrapper(getData, cid),
		getNodes: () => _promiseWrapper(getNodes),
		initResult,
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
