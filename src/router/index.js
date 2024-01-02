import {createRouter, createWebHashHistory} from 'vue-router' //引入vue-router

import Home from '@/views/Home'
import PieGroupedColumn from "@/views/CustomChart/Pie&GroupedColumn";
import HistogramRect from "@/views/CustomChart/HistogramRect";
import HistogramLine from "@/views/CustomChart/HistogramLine";

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
            path: '/histogramRect',
            name: 'HistogramRect',
            component: HistogramRect
        },
        {
            path: '/histogramLine',
            name: 'HistogramLine',
            component: HistogramLine
        }
    ],
    history: createWebHashHistory()
})
