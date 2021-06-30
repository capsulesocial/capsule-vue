const marked = require('marked')
export default {
  methods: {
    compileMarkdown (input) {
      console.log(input)
      return marked(input)
    },
  },
}
