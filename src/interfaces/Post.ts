import { Tag } from '@/interfaces/Tag'

export interface Post {
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
