import Vue from 'vue'
import Antd from 'ant-design-vue'
import App from './App'
import 'ant-design-vue/dist/antd.css'
import VueRouter from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookies from 'vue-cookies'
import VueMeta from 'vue-meta'
import config from './config'
import * as Sentry from '@sentry/browser'
import { Vue as VueIntegration } from '@sentry/integrations'

import Home from './components/Home'
import MetadataList from './components/MetadataList'
import MetadataInfo from './components/MetadataInfo'
import BookmarkList from './components/BookmarkList'
import BookmarkInfo from './components/BookmarkInfo'
import TagList from './components/TagList'
import StarList from './components/StarList'
import SeriesList from './components/SeriesList'
import Profile from './components/Profile'
import Login from './components/Login'
import Admin from './components/Admin'
import SignUp from './components/SignUp'

axios.defaults.withCredentials = true

Sentry.init({
    dsn: 'https://a070dfc175f04ef1943a02ae309c4ac2@o230009.ingest.sentry.io/5217416',
    integrations: [new VueIntegration({ Vue, attachProps: true })]
})
Vue.use(VueMeta)
Vue.use(VueCookies)
Vue.use(VueAxios, axios)
Vue.use(VueRouter)
Vue.use(Antd)

Vue.mixin({
    data: () => {
        return {
            apiHost: config.apiHost
        }
    }
})

Vue.config.productionTip = false

const routes = [
    {
        name: 'homepage',
        path: '/home',
        component: Home
    },
    {
        name: 'metadataList',
        path: '/metadata/list/:page?/:type?/:metaId?',
        component: MetadataList
    },
    {
        name: 'metadataInfo',
        path: '/metadata/view/:id',
        component: MetadataInfo
    },
    {
        name: 'bookmarkList',
        path: '/bookmark/list',
        component: BookmarkList
    },
    {
        name: 'bookmarkInfo',
        path: '/bookmark/list/:id/:page?',
        component: BookmarkInfo
    },
    {
        name: 'tagList',
        path: '/tag/list/:page?',
        component: TagList
    },
    {
        name: 'starList',
        path: '/star/list/:page?',
        component: StarList
    },
    {
        name: 'seriesList',
        path: '/series/list/:page?',
        component: SeriesList
    },
    {
        name: 'profile',
        path: '/profile',
        component: Profile
    },{
        name: 'admin',
        path: '/admin',
        component: Admin
    },
    {
        name: 'login',
        path: '/login',
        component: Login
    }
    ,
    {
        name: 'signup',
        path: '/signup',
        component: SignUp
    }
]

const router = new VueRouter({
    routes,
    scrollBehavior () {
        return { x: 0, y: 0 }
    }
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
