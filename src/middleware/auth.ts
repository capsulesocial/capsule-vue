export default function ({ store }: any) {
	// Clear store if no localStorage key
	const accountId: string | null = window.localStorage.getItem(`accountId`)
	const isAuthenticated: boolean = store.state.session.id !== `` || store.state.session.id !== null
	if (!accountId && isAuthenticated) {
		store.commit(`session/logout`)
	}
}
