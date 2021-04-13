const marked = require('marked');
export default {
  methods: {
    compileMarkdown(input) {
      return marked(input)
    }
  }
};