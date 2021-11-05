import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Auth from '../views/Auth.vue'
import User from '../views/User.vue'
import NotFound from '../views/NotFound.vue'
import { auth, db } from '../firebase'
import store from '../store'

const routes = [
	{
		path: '/',
		name: 'home',
		component: Home,
		meta: {
			header: true,
			title: 'Подписки'
		}
	},
	{
		path: '/auth',
		name: 'auth',
		component: Auth,
		meta: {
			header: false,
			title: 'Войти'
		}
	},
	{
		path: '/profile',
		name: 'profile',
		component: User,
		meta: {
			header: true,
			title: 'Профиль'
		}
	},
	{
		path: '/:catchAll(.*)',
		name: 'notFound',
		component: NotFound,
		meta: {
			header: true,
			title: 'Страница не найдена'
		}
	},
]

const router = createRouter({
	history: createWebHashHistory(process.env.BASE_URL),
	routes
})

async function getCurrentUser() {
	return new Promise(resolve => {
		auth.onAuthStateChanged(async user => {
			let userData = null
			if (user) {
				const userRef = db.ref(`users/${user.uid}/info`)
				const userRes = await userRef.get()
				userData = userRes.val()
			}
			store.commit('SET_USER', userData)
			resolve(user)
		})
	})
}

router.afterEach((to) => {
	document.title = to.meta.title + ' - ' + process.env.VUE_APP_TITLE
})

router.beforeEach(async (to, from, next) => {
	const user = await getCurrentUser()
	if (!user && to.name !== 'auth') {
		next({ name: 'auth' })
	} else if (user && to.name === 'auth') {
		next({ name: 'profile' })
	} else {
		next()
	}
	store.commit('SET_LOADER', false)
})

export default router
