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
export default function ({ store }: any) {
	// Clear store if no localStorage key
	const accountId: string | null = window.localStorage.getItem(`accountId`)
	const isAuthenticated: boolean = store.state.session.id !== `` || store.state.session.id !== null
	if (!accountId && isAuthenticated) {
		store.commit(`session/logout`)
	}
}
