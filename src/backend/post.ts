import axios from 'axios'

import { signContent, verifyContent } from './utilities/keys'
import ipfs from './utilities/ipfs'
import { hexStringToUint8Array, ISignedIPFSObject, uint8ArrayToHexString } from './utilities/helpers'
import { nodeUrl } from './utilities/config'
import { IRepost } from './reposts'
import { decryptData, encryptAndSignData } from './crypto'
import { getUserInfoNEAR } from './near'
import { genericRequest } from './utilities/request'
export interface Tag {
	name: string
}

export interface Post {
	authorID: string
	title: string
	subtitle: string | null
	content: string
	category: string
	featuredPhotoCID?: string | null
	featuredPhotoCaption?: string | null
	timestamp: number
	tags: Tag[]
	encrypted?: boolean
	postImages?: Array<string>
}

export interface IRegularPost extends Post {
	encrypted?: false
}

export interface IEncryptedPost extends Post {
	encrypted: true
	subtitle: string
}

export type RetrievedPost = Omit<Post, `content`> & { _id: string; excerpt: string; wordCount?: number }

export interface IGenericPostResponse {
	post: RetrievedPost
	bookmarked: boolean
	reposted?: string
	bookmarksCount: number
	commentsCount: number
	repostCount: number
	repost?: IRepost
}

export type IPostResponse = Omit<IGenericPostResponse, `repost`>
export type IPostResponseWithHidden = IPostResponse & { hidden: boolean }
export interface IRepostResponse extends IGenericPostResponse {
	repost: IRepost
	deleted: boolean
}

export type SubscriptionStatus = `SUBSCRIBED` | `INSUFFICIENT_TIER` | `NOT_SUBSCRIBED`
export interface IKeyRetrievalStatus {
	status: SubscriptionStatus
}

export interface IKeyData {
	key: string
	counter: string
}
export interface IPostImageKey extends IKeyData {
	imageCID: string
}

export interface IKeyRetrievalSuccess extends IKeyRetrievalStatus {
	status: `SUBSCRIBED`
	post: IKeyData
	postImages: Array<IPostImageKey>
}
export interface IKeyRetrievalFailure extends IKeyRetrievalStatus {
	status: `INSUFFICIENT_TIER` | `NOT_SUBSCRIBED`
	enabledTiers: Array<string>
}

export type IKeyRetrievalResult = IKeyRetrievalFailure | IKeyRetrievalSuccess

export function keyRetrievalFailed(keyStatus: IKeyRetrievalResult): keyStatus is IKeyRetrievalFailure {
	return keyStatus.status === `INSUFFICIENT_TIER` || keyStatus.status === `NOT_SUBSCRIBED`
}

export type Algorithm = `NEW` | `FOLLOWING` | `TOP`
export type Timeframe = `1` | `7` | `30` | `365`

export function createRegularPost(
	title: string,
	subtitle: string | null,
	content: string,
	category: string,
	tags: Tag[],
	authorID: string,
	featuredPhotoCID?: string | null,
	featuredPhotoCaption?: string | null,
	postImages?: Array<string>,
): IRegularPost {
	if (subtitle !== null) {
		subtitle = subtitle.trim()
	}
	return {
		title: title.trim(),
		subtitle,
		content,
		category,
		timestamp: Date.now(),
		tags,
		authorID,
		...(featuredPhotoCID ? { featuredPhotoCID } : {}),
		...(featuredPhotoCaption ? { featuredPhotoCaption } : {}),
		encrypted: false,
		postImages,
	}
}

export function createEncryptedPost(
	title: string,
	subtitle: string,
	content: string,
	category: string,
	tags: Tag[],
	authorID: string,
	featuredPhotoCID?: string | null,
	featuredPhotoCaption?: string | null,
	postImages?: Array<string>,
): IEncryptedPost {
	return {
		title: title.trim(),
		subtitle: subtitle.trim(),
		content,
		category,
		timestamp: Date.now(),
		tags,
		authorID,
		...(featuredPhotoCID ? { featuredPhotoCID } : {}),
		...(featuredPhotoCaption ? { featuredPhotoCaption } : {}),
		encrypted: true,
		postImages,
	}
}

export async function sendRegularPost(data: IRegularPost): Promise<string> {
	const { sig, publicKey } = await signContent(data)

	const ipfsData: ISignedIPFSObject<IRegularPost> = { data, sig: uint8ArrayToHexString(sig), public_key: publicKey }

	const cid = await ipfs().sendJSONData(ipfsData)
	await axios.post(`${nodeUrl()}/content`, {
		cid,
		data: ipfsData,
		type: `post`,
	})

	return cid
}

export async function sendEncryptedPost(
	data: IEncryptedPost,
	tiers: Array<string>,
	imageKeysMap: Map<string, { key?: string; counter?: string }> = new Map(),
): Promise<string> {
	const { data: post, key, counter, sig, publicKey } = await encryptAndSignData(data)
	const imageKeys = Array.from(imageKeysMap.keys()).map((k) => ({
		cid: k,
		key: imageKeysMap.get(k)?.key,
		counter: imageKeysMap.get(k)?.counter,
	}))

	const ipfsData: ISignedIPFSObject<IEncryptedPost> = { data: post, sig, public_key: publicKey }

	const cid = await ipfs().sendJSONData(ipfsData)
	await genericRequest({
		method: `post`,
		path: `/content`,
		body: { postKey: { key, counter }, data: ipfsData, cid, tiers, imageKeys },
		username: post.authorID,
	})
	await axios.post(`${nodeUrl()}/content`, {
		cid,
		data: ipfsData,
		type: `post`,
	})

	return cid
}

export async function getPost(cid: string) {
	const post = await ipfs().getJSONData<ISignedIPFSObject<Post>>(cid)
	// Always evaluates to false
	if (!isRegularPost(post.data) && !isEncryptedPost(post.data)) {
		throw new Error(`Post should either be encrypted or public`)
	}
	return post
}

export async function getRegularPost(cid: string): Promise<ISignedIPFSObject<IRegularPost>> {
	const post = await ipfs().getJSONData<ISignedIPFSObject<IRegularPost>>(cid)
	if (!isRegularPost(post.data)) {
		throw new Error(`Post is encrypted`)
	}
	return post
}

export async function getDecryptedContent(cid: string, content: string, username: string) {
	const result = await getEncryptionKeys(username, cid)
	if (keyRetrievalFailed(result)) {
		return result
	}

	const { key, counter } = result.post
	const decryptedContent = await decryptData(content, key, counter)

	return { content: decryptedContent, postImageKeys: result.postImages }
}

export function isEncryptedPost(post: Post): post is IEncryptedPost {
	return `encrypted` in post && post.encrypted === true
}

export function isRegularPost(post: Post): post is IRegularPost {
	return !post.encrypted
}

async function getEncryptionKeys(username: string, cid: string) {
	const res = await genericRequest<IKeyRetrievalResult>({
		method: `get`,
		path: `/content/${cid}`,
		username,
	})
	return res
}

export interface IGetPostsOptions {
	sort?: Algorithm
	offset?: number
	limit?: number
	following?: string
}

export async function getPosts(
	filter: {
		category?: string
		authorID?: string
		tag?: string
		bookmarkedBy?: string
		timeframe?: Timeframe
		encrypted?: boolean
	},
	bookmarker: string,
	options: IGetPostsOptions,
): Promise<IPostResponse[] | IRepostResponse[]> {
	const { sort, offset = 0, limit = 10, following } = options
	if (sort === `FOLLOWING` && !following) {
		throw new Error(`No following provided`)
	}
	const res = await axios.get(`${nodeUrl()}/content`, {
		params: {
			...filter,
			sort,
			...(following && sort === `FOLLOWING` ? { following } : {}),
			offset,
			limit,
			bookmarker,
		},
	})
	return res.data.data
}

export async function getTags(): Promise<string[]> {
	const res = await axios.get(`${nodeUrl()}/content/tags`)
	return res.data.data
}

export async function getOnePost(cid: string, bookmarker: string): Promise<IPostResponseWithHidden> {
	const res = await axios.get(`${nodeUrl()}/content/${cid}`, { params: { bookmarker } })
	return res.data.data
}

export async function verifyPostAuthenticity(post: Post, sig: string, publicKey: string) {
	try {
		const { publicKey: contractPubKey } = await getUserInfoNEAR(post.authorID)
		if (uint8ArrayToHexString(contractPubKey) !== publicKey) {
			return false
		}
		const verified = verifyContent(post, hexStringToUint8Array(sig), contractPubKey)
		return verified
	} catch (err: any) {
		return false
	}
}
