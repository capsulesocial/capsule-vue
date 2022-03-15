import { Plugin } from '@nuxt/types'
import VuexPersistence from 'vuex-persist'

const storePlugin: Plugin = ({ store }) => {
	new VuexPersistence({
		/* your options */
	}).plugin(store)
}

export default storePlugin
