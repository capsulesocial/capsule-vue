import { Tag } from '@/interfaces/Tag'
import { Comment } from '@/interfaces/Comment'

export interface Post {
	cid: string
	id: string
	authorID: string
	authorCID: string
	title: string
	subtitle: string
	content: string
	featuredPhotoCID: string
	tags: Tag[]
	timestamp: Date
	comments: Comment[]
	bookmarks: string[]
}
