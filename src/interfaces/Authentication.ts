import { PrivateKey } from '@/interfaces/PrivateKey'

export interface Authentication {
	privateKey: PrivateKey
	signingKey: PrivateKey
	id: string
	nearAccountId: string
}
