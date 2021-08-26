export interface BackendProfile {
	id: string
	name: string
	email: string
	bio: string
	location: string
	avatar: string
	socials: string[]
	publicKey: string
}

export interface Profile {
	id: BackendProfile[`id`]
	name: BackendProfile[`name`]
	email: BackendProfile[`email`]
	bio: BackendProfile[`bio`]
	location: BackendProfile[`location`]
	avatar: BackendProfile[`avatar`]
	socials: BackendProfile[`socials`]
	publicKey: BackendProfile[`publicKey`]
	cid: string
	posts: string[]
	reposts: string[]
	comments: string[]
	bookmarks: string[]
	categories: string[]
	following: string[]
	followers: string[]
}
