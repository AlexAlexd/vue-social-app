import { db } from '../firebase'

export default {
	install: (app, options) => {
		async function increaseCount(path) {
			const countRef = db.ref(path)
			const countRes = await countRef.get()
			let count = countRes.val()
			count += 1
			await countRef.set(count)
			return count
		}
		app.provide('increaseCount', increaseCount)
	}
}