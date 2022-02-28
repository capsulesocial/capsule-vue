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
	init: { algorithm: `Ed25519` },
	preload: {
		enabled: true,
		addresses: [`/dns4/test-node.capsule.social/https`],
	},
	config: {
		Bootstrap: bootstrapNodes,
	},
}

async function createIPFSInterface(): Promise<IPFSInterface> {
	const node = await create(ipfsConfig)

	function maintainConnection() {
		setTimeout(async () => {
			for (const a of bootstrapNodes) {
				await node.swarm.disconnect(a)
				await node.swarm.connect(a)
			}
			maintainConnection()
		}, 10000)
	}

	maintainConnection()

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

	return {
		getJSONData,
		sendJSONData,
		sendData,
		getData,
		getNodes,
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
