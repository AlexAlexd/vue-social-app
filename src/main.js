import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './assets/scss/vars.scss'
import './assets/scss/main.scss'
import './assets/scss/classes.scss'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
library.add(fas);
library.add(far);

import increaseCount from './plugins/increaseCount'
createApp(App)
	.use(store)
	.use(router)
	.use(increaseCount)
	.component('font-awesome-icon', FontAwesomeIcon)
	.mount('#app')

const checkForIconMode = () => {
	store.commit('SET_ICON_MODE', window.innerWidth < 478)
}
checkForIconMode()
window.onresize = checkForIconMode



