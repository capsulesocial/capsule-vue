import axios, { Method, AxiosError, AxiosRequestConfig } from 'axios'
import { getToken } from '../tokenAuth'
import { capsuleServer } from './config'

export interface IGenericRequestConfig<T, S> {
	method: Method
	path: string
	body?: T
	username?: string
	params?: S
}

export async function genericRequest<T, S, R = any>(config: IGenericRequestConfig<T, S>) {
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
