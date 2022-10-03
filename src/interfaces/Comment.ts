import { Emotions } from '../config/config'
export interface Comment {
	authorID: string
	authorAvatarCID: string
	content: string
	emotion: Emotions
	timestamp: Date
	replies: any[]
}
