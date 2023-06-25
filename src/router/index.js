import { createRouter, createWebHashHistory } from "vue-router";


const routes = [
    {
        path: '/',
        name: 'App',
        component: () => import("../views/home/index.vue")
    }
]



export default createRouter({
    routes,
    history: createWebHashHistory()
})