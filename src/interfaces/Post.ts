import { Tag } from '@/interfaces/Tag'

export interface Post {
	cid: string
	id: string
	authorID: string
	authorCID: string
	title: string
	subtitle: string
	content: string
	category: string
	featuredPhotoCID: string
	timestamp: Number
	tags: Tag[]
}
