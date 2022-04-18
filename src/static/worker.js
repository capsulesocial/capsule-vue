// import { verifyPostAuthenticity } from 'src/backend/post'

onmessage = function (e) {
	try {
		// Post object
		console.log(e.data[0])
		// await verifyPostAuthenticity(e.data[0])
	} catch (err) {
		console.log(`errorrrr`)
	}
}
