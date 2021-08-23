import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
	createPersistedState({
		key: `capsule-store`,
	})(store)
}
