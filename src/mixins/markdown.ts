import marked from 'marked'

export default {
	methods: {
		compileMarkdown(input: string) {
			return marked(input)
		},
	},
}
