const marked = require(`marked`)
export default {
	methods: {
		compileMarkdown(input: string) {
			return marked(input)
		},
	},
}
