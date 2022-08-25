/*
 * Copyright (c) 2021-2022 Capsule Social, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */
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
