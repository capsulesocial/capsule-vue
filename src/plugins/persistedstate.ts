import createPersistedState from 'vuex-persistedstate'

// @ts-ignore
export default ({ store }) => {
	createPersistedState({
		key: `capsule-store`,
	})(store)
}
