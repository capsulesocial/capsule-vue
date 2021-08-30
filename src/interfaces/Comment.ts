export interface Comment {
	authorID: string
	authorAvatarCID: string
	content: string
	emotion: string
	timestamp: Date
	replies: any[]
}
