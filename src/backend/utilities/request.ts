import axios, { Method, AxiosError, AxiosRequestConfig } from 'axios'
import { getToken } from '../tokenAuth'
import { capsuleServer } from './config'

export interface IBaseRequestConfig {
	method: Method
	path: string
	username?: string
}

export interface IFullRequestConfig<B, P> extends IBaseRequestConfig {
	body?: B
	params?: P
}

export interface IGenericRequestConfigWithBody<B> extends IFullRequestConfig<B, undefined> {
	body: B
}

export interface IGenericRequestConfigWithParams<P> extends IFullRequestConfig<undefined, P> {
	params: P
}

export async function genericRequest<R = any>(config: IBaseRequestConfig): Promise<R>
export async function genericRequest<B, R = any>(config: IGenericRequestConfigWithBody<B>): Promise<R>
export async function genericRequest<P, R = any>(config: IGenericRequestConfigWithParams<P>): Promise<R>
export async function genericRequest<B, P, R = any>(config: IFullRequestConfig<B, P>): Promise<R> {
	const { method, path, body, username, params } = config
	let authToken: null | string = null
	if (username) {
		authToken = await getToken(username)
	}

	const reqConfig: AxiosRequestConfig = {
		method,
		url: `${capsuleServer}${path}`,
		data: body,
		...(params ? { params } : {}),
	}

	try {
		const res = await axios({ ...reqConfig, headers: authToken ? { authorization: `Bearer ${authToken}` } : {} })
		return res.data as R
	} catch (err) {
		if (err instanceof AxiosError) {
			// Try again once with a new token
			if (err.response && err.response.status === 401 && username) {
				authToken = await getToken(username, true)
				const res = await axios({ ...reqConfig, headers: authToken ? { authorization: `Bearer ${authToken}` } : {} })
				return res.data as R
			}
		}

		throw err
	}
}
