import Vue from 'vue'
import IpfsImage from './IpfsImage.vue'

export default function readerViewFactory(template: string) {
	return Vue.component(`ReaderView`, {
		components: { IpfsImage },
		template,
	})
}
