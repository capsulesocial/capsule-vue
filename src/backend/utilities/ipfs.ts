import { create, Options, CID } from 'ipfs-core'
import { bootstrapNodes } from './config'

export interface IPFSInterface {
	sendData: (content: string | ArrayBuffer) => Promise<string>
	getData: (cid: string) => Promise<string>
	getJSONData: <T>(hash: string) => Promise<T>
	sendJSONData: <T>(content: T) => Promise<string>
	getNodes: () => Promise<number>
}

const ipfsConfig: Options = {
	start: false,
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
			for (const a of bootstrapNodes) {
				await node.swarm.disconnect(a)
				await node.swarm.connect(a)
			}
			_maintainConnection()
		}, 10000)
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
		const cid = await node.dag.put(content)
		return cid.toString()
	}

	const getNodes = async () => {
		const peers = await node.swarm.peers()
		return peers.length
	}

	node.start().then(() => {
		// eslint-disable-next-line no-console
		console.log(`IPFS is initialising...`)
		ipfsInitialised = true
		_maintainConnection()
		_resolveCachedPromises()
		// eslint-disable-next-line no-console
		console.log(`IPFS initialised!`)
	})

	return {
		getJSONData: <T>(cid: string) => _promiseWrapper<T>(getJSONData, cid),
		sendJSONData: <T>(content: T) => _promiseWrapper<string>(sendJSONData, content),
		sendData: (content: string | ArrayBuffer) => _promiseWrapper(sendData, content),
		getData: (cid: string) => _promiseWrapper(getData, cid),
		getNodes: () => _promiseWrapper(getNodes),
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
