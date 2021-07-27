import { PrivateKey } from '@/interfaces/PrivateKey'

export interface Authentication {
	privateKey: PrivateKey
	id: string
	profileCID: string
}
