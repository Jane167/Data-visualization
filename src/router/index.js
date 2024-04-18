import {createRouter, createWebHashHistory} from 'vue-router' //引入vue-router

import HomePage from '@/views/HomePage'
import PieGroupedColumn from "@/views/CustomChart/Pie&GroupedColumn";
import HistogramRect from "@/views/CustomChart/HistogramRect";
import HistogramLine from "@/views/CustomChart/HistogramLine";
import HistogramMulti from "@/views/CustomChart/HistogramMulti";
import BoxPlot from "@/views/CustomChart/BoxPlot";

export default new createRouter({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: HomePage
        },
        {
            path: '/home',
            name: 'Home',
            component: HomePage
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
        },
        {
            path: '/histogramMulti',
            name: 'HistogramMulti',
            component: HistogramMulti
        },
        {
            path: '/boxPlot',
            name: 'BoxPlot',
            component: BoxPlot
        },
        {
            path: '/volcanoPlot',
            name: 'Volcano',
            component: () => import("@/views/CustomChart/VolcanoPage.vue")
        }
    ],
    history: createWebHashHistory()
})
