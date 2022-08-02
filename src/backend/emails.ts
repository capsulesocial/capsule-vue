import { AxiosError } from 'axios'
import { genericRequest } from './utilities/request'

export enum EmailSubscriptionMode {
	AllPosts = `AllPosts`,
	Topics = `Topics`,
}

export interface IEmailSubscription {
	_id?: string
	username?: string
	authorID: string
	email: string
	verified: boolean
	createdAt: Date
	updatedAt: Date
	topics: string[]
	mode: EmailSubscriptionMode
}

export interface UserEmail {
	email: string
	authorSubbed: boolean
}

export async function startEmailSubscription(
	authorID: string,
	email: string,
	topics: string[] = [],
	mode: EmailSubscriptionMode = EmailSubscriptionMode.AllPosts,
	username?: string,
) {
	try {
		const body = {
			authorID,
			email,
			topics,
			mode,
		}
		const response = await genericRequest({
			method: `post`,
			path: `/emails/auth/subscribe`,
			username,
			body,
		})
		return response
	} catch (err) {
		if (err instanceof AxiosError && err.response) {
			throw new Error(err.response.data?.error ?? err.message)
		}
		throw new Error(`Network error: ${err}`)
	}
}

export async function listAllAuthors(username: string) {
	try {
		const response = await genericRequest<{ data: Array<string> }>({
			method: `get`,
			path: `/emails/authors`,
			username,
		})
		return response.data
	} catch (err) {
		if (err instanceof AxiosError && err.response) {
			throw new Error(err.response.data?.error ?? err.message)
		}
		throw new Error(`Network error: ${err}`)
	}
}

export async function listForAuthor(authorID: string, username: string) {
	try {
		const response = await genericRequest<{ authorID: string }, { data: Array<IEmailSubscription> }>({
			method: `get`,
			path: `/emails/subscribed`,
			params: { authorID },
			username,
		})
		return response.data
	} catch (err) {
		if (err instanceof AxiosError && err.response) {
			throw new Error(err.response.data?.error ?? err.message)
		}
		throw new Error(`Network error: ${err}`)
	}
}

export async function listEmails(username: string, authorID: string) {
	try {
		const response = await genericRequest<{ authorID: string }, { data: Array<UserEmail> }>({
			method: `get`,
			path: `/emails/list`,
			username,
			params: { authorID },
		})
		return response.data
	} catch (err) {
		if (err instanceof AxiosError && err.response) {
			throw new Error(err.response.data?.error ?? err.message)
		}
		throw new Error(`Network error: ${err}`)
	}
}

export async function deleteSubscription(username: string, id: string) {
	try {
		const response = await genericRequest({
			method: `delete`,
			path: `/emails/${id}`,
			username,
		})
		return response.data
	} catch (err) {
		if (err instanceof AxiosError && err.response) {
			throw new Error(err.response.data?.error ?? err.message)
		}
		throw new Error(`Network error: ${err}`)
	}
}
