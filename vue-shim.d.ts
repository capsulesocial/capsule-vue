/* eslint-disable quotes */

declare module '*.vue' {
	import Vue from 'vue'
	export default Vue
}
declare module 'quilljs-markdown' {
	import { Quill } from 'quill'
	export default class QuillMarkdown extends Quill {
		constructor(editor: Quill, options: any)
	}
}

declare module '*.png' {
	// eslint-disable-next-line init-declarations
	const value: string
	export default value
}

declare module 'turndown-plugin-gfm' {
	// eslint-disable-next-line init-declarations
	const strikethrough: any
	export { strikethrough }
}
