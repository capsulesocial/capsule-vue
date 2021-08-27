export interface Comment {
	postID: string
	authorID: string
	authorAvatarCID: string
	content: string
	emotion: string
	timestamp: Date
	replies: any[]
}
