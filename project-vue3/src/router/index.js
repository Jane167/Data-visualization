import {createRouter, createWebHashHistory} from 'vue-router' //引入vue-router

import Home from '@/views/Home'
import HelloWorld from '../components/HelloWorld'

export default new createRouter({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/home',
            name: 'Home',
            component: Home
        },
        {
            path: '/hello',
            name: 'HelloWorld',
            component: HelloWorld
        },
        {
            path: '/hello',
            name: 'HelloWorld',
            component: HelloWorld
        }
    ],
    history: createWebHashHistory()
})
