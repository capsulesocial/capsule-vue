import { Tag } from '@/interfaces/Tag'

export interface Post {
	authorID: string
	title: string
	content: string
	category: string
	featuredPhotoCID?: string | null
	timestamp: number
	tags: Tag[]
}
