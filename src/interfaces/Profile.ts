import { Post } from '@/interfaces/Post'
import { Comment } from '@/interfaces/Comment'

export interface Profile {
	cid: string
	id: string
	name: string
	email: string
	password: string
	bio: string
	location: string
	avatar: string
	posts: Post[]
	reposts: Post[]
	socials: []
	comments: Comment[]
	bookmarks: string[]
	categories: string[]
	following: string[]
	followers: string[]
}
