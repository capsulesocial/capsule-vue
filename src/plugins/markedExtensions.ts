import hljs from 'highlight.js'
import { marked } from 'marked'

export const markedRenderer: marked.RendererObject = {
	code(src: string) {
		const highlightedCode = hljs.highlightAuto(src).value
		return `<pre><code class="hljs">${highlightedCode}</code></pre>`
	},
	image(href: string | null, title: string | null, text: string | null) {
		return `<img src="${href}" alt="${title}" alt="${text}">`
	},
}
