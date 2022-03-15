import VuexPersistence from 'vuex-persist'

export default ({ store }: any) => {
	new VuexPersistence({
		/* your options */
		key: `capsule-store`,
	}).plugin(store)
}
