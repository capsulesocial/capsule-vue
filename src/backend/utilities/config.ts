import type { SubVerifierDetails, TORUS_NETWORK_TYPE } from '@toruslabs/customauth'
import type { ILocalNetNearConfig, INearConfig } from '../near'

const defaultBootstraps = [
	`/dns4/node1.blogchain.app/tcp/443/wss/p2p/12D3KooW9qeCwGnG7ncn1YFh7Kth7oH93TCmMuAzdafV8WwGTMkX`,
	`/dns4/node2.blogchain.app/tcp/443/wss/p2p/12D3KooWBidnLf4iRGgZpeFVCqQjNzAsSx2opZPbG8o9tpCf2rG5`,
	`/dns4/node3.blogchain.app/tcp/443/wss/p2p/12D3KooWLtqhi2h8Mnb7NxfEWuAkVEkTi9FVLQPDV1PZ3ioQooW2`,
	`/dns4/node4.blogchain.app/tcp/443/wss/p2p/12D3KooWRzXVsB3cf57W9KzDD97EFVcQZFP8Cb4XBbmwK3SK3tME`,
	`/dns4/alpha.capsule.social/tcp/443/wss/p2p/12D3KooWF5TY7Wisj3nZzfoE2uKTxUpBAooUSUU8yucsJnkBxbpo`,
	`/dns4/payments.capsule.social/tcp/443/wss/p2p/12D3KooWBUvj6A9iNe6zPoz3i8sxhJSBNiGGL8tqRN5bY3a3khPv`,
]

export const capsuleOrbit = process.env.ORBIT_URL || `https://test-node.capsule.social/orbit`
export const capsuleServer = process.env.CAPSULE_SERVER || `https://test-node.capsule.social/server`
export const domain = process.env.DOMAIN || `http://localhost:3000`
export const contractName = process.env.CONTRACT_NAME || `capsule-vue`
export const sufficientFunds = process.env.SUFFICIENT_ACCOUNT_FUNDS || `8180000000000000000000`
// Time-sensitive signatures are valid for 5 minutes
export const sigValidity = 5 * 60000
export const bootstrapNodes = process.env.BOOTSTRAP_NODES ? JSON.parse(process.env.BOOTSTRAP_NODES) : defaultBootstraps

export const stripePublishableKey =
	process.env.STRIPE_PUBLISHABLE_KEY ||
	`pk_test_51I81pBCPCJ3FaYLGnUrPUMxipudV7gWWA7qAiqIVMAqnULA4a2uluUgBQxX8yKzAe2iGYOoSMX2rSbF45wtKlhXI00Olk8hJmc`

const parsedTorusNetwork = process.env.TORUS_NETWORK
if (parsedTorusNetwork && parsedTorusNetwork !== `mainnet` && parsedTorusNetwork !== `testnet`) {
	throw new Error(`Unexpected Torus Network!`)
}
export const torusNetwork: TORUS_NETWORK_TYPE = (parsedTorusNetwork as `mainnet` | `testnet` | undefined) || `testnet`

export const nearNetwork = process.env.NEAR_NETWORK || `testnet`

export function nodeUrl() {
	const preferredNodeUrl = window.localStorage.getItem(`preferredNodeUrl`)
	if (!preferredNodeUrl) {
		return capsuleOrbit
	}

	return preferredNodeUrl + `/orbit`
}

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

export const hcaptchaSiteKey = process.env.HCAPTCHA_SITE_KEY
	? process.env.HCAPTCHA_SITE_KEY
	: `10000000-ffff-ffff-ffff-000000000001`

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
