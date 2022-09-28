// Misc

const imgRegexp = (cid: string) =>
	new RegExp(`<ipfsimage ((alt="${cid}" cid="${cid}")|(cid="${cid}" alt="${cid}"))></ipfsimage>`, `g`)

const blankImage = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAADUlEQVR42mM8fIaBAQAFegGROSevSQAAAABJRU5ErkJggg==`

export function transformPostToHTML(body: string, postImages?: Array<string>) {
	if (!postImages) {
		return body
	}
	for (const cid of postImages) {
		body = body.replace(imgRegexp(cid), `<img alt="${cid}" cid="${cid}" src="${blankImage}" />`)
	}
	return body
}
