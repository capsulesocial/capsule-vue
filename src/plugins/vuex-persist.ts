import VuexPersistence from 'vuex-persist'

// @ts-ignore
export default ({ store }) => {
	new VuexPersistence({
		/* your options */
	}).plugin(store)
}
