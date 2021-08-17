const networkId = process.env.NETWORK_ID || `testnet`
const contractName = process.env.CONTRACT_NAME || `capsule-vue`

let nodeUrl = `https://rpc.testnet.near.org`
let walletUrl = `https://wallet.testnet.near.org`
let helperUrl = `https://helper.testnet.near.org`
let explorerUrl = `https://explorer.testnet.near.org`
let SERVER_URL = process.env.TESTNET_SERVER_URL || `http://localhost:8080`
let DOMAIN = process.env.TESTNET_DOMAIN || `http://localhost:3000`

if (networkId === `mainnet`) {
	nodeUrl = `https://rpc.mainnet.near.org`
	walletUrl = `https://wallet.mainnet.near.org`
	helperUrl = `https://helper.mainnet.near.org`
	explorerUrl = `https://explorer.mainnet.near.org`
	SERVER_URL = `${process.env.MAINNET_SERVER_URL}`
	DOMAIN = `${process.env.MAINNET_DOMAIN}`
}

export default {
	networkId,
	nodeUrl,
	contractName,
	walletUrl,
	helperUrl,
	explorerUrl,
	SERVER_URL,
	DOMAIN,
}
