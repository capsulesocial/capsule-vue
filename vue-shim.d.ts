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
