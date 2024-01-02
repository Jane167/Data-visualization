import {createRouter, createWebHashHistory} from 'vue-router' //引入vue-router

import Home from '@/views/Home'
import HelloWorld from '../components/HelloWorld'
import PieGroupedColumn from "@/views/Chart/Pie&GroupedColumn";

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
          path: '/pie&groupedColumn',
          name: 'Pie&GroupedColumn',
          component: PieGroupedColumn,
        },
        {
            path: '/hello',
            name: 'HelloWorld',
            component: HelloWorld
        }
    ],
    history: createWebHashHistory()
})
