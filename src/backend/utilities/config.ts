// eslint-disable-next-line import/named
import { SubVerifierDetails } from '@toruslabs/customauth'
import { ILocalNetNearConfig, INearConfig } from '../near'

export const capsuleOrbit = process.env.ORBIT_URL || `https://test-node.capsule.social/orbit`
export const capsuleServer = process.env.CAPSULE_SERVER || `https://test-node.capsule.social/server`
export const domain = process.env.DOMAIN || `http://localhost:3000`
export const contractName = process.env.CONTRACT_NAME || `capsule-vue`

const nearNetwork = process.env.NEAR_NETWORK || `testnet`

// Environment variables only for NEAR localnet network
const homeDir = process.env.HOME_DIR || `/home/capsule`
const nearNodeUrl = process.env.NEAR_NODE_URL || `http://localhost:3030`
const nearWalletUrl = process.env.NEAR_WALLET_URL || `http://localhost:4000/wallet`

const torusEnv = {
	google: {
		verifier: process.env.TORUS_GOOGLE_VERIFIER || `capsule-social-test-google`,
		clientId:
			process.env.TORUS_GOOGLE_CLIENTID || `653379121360-j8t9ua763vfvd86d1qjguonhrgqvkigo.apps.googleusercontent.com`,
	},
	discord: {
		verifier: process.env.TORUS_DISCORD_VERIFIER || `capsule-social-test-discord`,
		clientId: process.env.TORUS_DISCORD_CLIENTID || `906210984396468275`,
	},
}

export function getNearConfig(): INearConfig | ILocalNetNearConfig {
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
		case `local`:
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

export type TorusVerifiers = `google` | `discord`
export const torusVerifiers: Record<TorusVerifiers, SubVerifierDetails> = {
	google: {
		typeOfLogin: `google`,
		verifier: torusEnv.google.verifier,
		clientId: torusEnv.google.clientId,
	},
	discord: {
		typeOfLogin: `discord`,
		verifier: torusEnv.discord.verifier,
		clientId: torusEnv.discord.clientId,
	},
}
