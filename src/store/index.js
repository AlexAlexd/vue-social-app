import { createStore } from 'vuex'

export default createStore({
	state: {
		user: null,
		showLoader: true,
		iconMode: false
	},
	mutations: {
		SET_USER(state, value) {
			state.user = value
		},
		SET_USER_IMAGE(state, value) {
			state.user.main.image = value
		},
		SET_USER_NAME(state, value) {
			state.user.main.name = value
		},
		SET_LOADER(state, value) {
			state.showLoader = value
		},
		SET_ICON_MODE(state, value) {
			state.iconMode = value
		},
	},
	actions: {
	},
	modules: {
	},
	getters: {
		getUser(state) {
			return state.user
		},
		getIconMode(state) {
			return state.iconMode
		},
	}
})
