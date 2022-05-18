import axios, { Method, AxiosError, AxiosRequestConfig } from 'axios'
import { getToken } from '../tokenAuth'
import { capsuleServer } from './config'

export interface IGenericRequestConfig<T> {
	method: Method
	path: string
	body?: T
	username?: string
}

export async function genericRequest<T, R = any>(config: IGenericRequestConfig<T>) {
	const { method, path, body, username } = config
	let authToken: null | string = null
	if (username) {
		authToken = await getToken(username)
	}

	const reqConfig: AxiosRequestConfig = {
		method,
		url: `${capsuleServer}${path}`,
		data: body,
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
