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
function promiseCache<T>() {
	const _promiseCache = new Map<string, Promise<T>>()

	return function (key: string, func: (k: string) => Promise<T>): Promise<T> {
		const cached = _promiseCache.get(key)
		if (cached !== undefined) {
			return cached
		}

		const promise = func(key).then((res) => {
			_promiseCache.delete(key)
			return res
		})
		_promiseCache.set(key, promise)
		return promise
	}
}

export default function cache<T>(fetchFunction: (key: string) => Promise<T>) {
	const _cache = new Map<string, T>()
	const _promiseCache = promiseCache<T>()

	return async function (key: string, update = false): Promise<T> {
		if (!update) {
			const cached = _cache.get(key)
			if (cached !== undefined) {
				if (typeof cached === `object`) {
					return { ...cached }
				}
				return cached
			}
		}

		const result = await _promiseCache(key, fetchFunction)
		_cache.set(key, result)
		if (typeof result === `object`) {
			return { ...result }
		}
		return result
	}
}
