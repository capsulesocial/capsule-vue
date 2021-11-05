import createPersistedState from 'vuex-persistedstate'

export default ({ store }: { store: any }) => {
	createPersistedState({
		key: `capsule-store`,
	})(store)
}
