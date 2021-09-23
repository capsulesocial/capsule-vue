export const capsuleServer = process.env.SERVER_URL || `https://test-node.capsule.social/server`
export const capsuleOrbit = process.env.ORBIT_URL || `https://test-node.capsule.social/orbit`
export const domain = process.env.DOMAIN || `http://localhost:3000`
export const contractName = process.env.CONTRACT_NAME || `capsule-vue`

const nearNetwork = process.env.NEAR_NETWORK || `testnet`

// Environment variables only for NEAR localnet network
const homeDir = process.env.HOME_DIR || `/home/capsule`
const nearNodeUrl = process.env.NEAR_NODE_URL || `http://localhost:3030`
const nearWalletUrl = process.env.NEAR_WALLET_URL || `http://localhost:4000/wallet`

export function getNearConfig() {
	switch (nearNetwork) {
		case `testnet`:
			return {
				networkId: `testnet`,
				nodeUrl: `https://rpc.testnet.near.org`,
				contractName,
				walletUrl: `https://wallet.testnet.near.org`,
				helperUrl: `https://helper.testnet.near.org`,
				explorerUrl: `https://explorer.testnet.near.org`,
			}
		case `mainnet`:
			return {
				networkId: `mainnet`,
				nodeUrl: `https://rpc.mainnet.near.org`,
				contractName,
				walletUrl: `https://wallet.near.org`,
				helperUrl: `https://helper.mainnet.near.org`,
				explorerUrl: `https://explorer.mainnet.near.org`,
			}
		case `betanet`:
			return {
				networkId: `betanet`,
				nodeUrl: `https://rpc.betanet.near.org`,
				contractName,
				walletUrl: `https://wallet.betanet.near.org`,
				helperUrl: `https://helper.betanet.near.org`,
				explorerUrl: `https://explorer.betanet.near.org`,
			}
		case `localnet`:
			return {
				networkId: `local`,
				nodeUrl: nearNodeUrl,
				keyPath: `${homeDir}/.near/validator_key.json`,
				walletUrl: nearWalletUrl,
				contractName,
			}
		default:
			throw new Error(`Invalid NEAR network type`)
	}
}
