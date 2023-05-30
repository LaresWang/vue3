import { createRouter, createWebHistory } from "vue-router"
import TestView from "../views/TestView.vue"
import Login from "../views/login/index.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      redirect: "/login"
    },
    {
      path: "/test",
      name: "test",
      component: TestView
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue")
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: `/forgetPassword`,
      name: "forgetpwd",
      component: () => import("../views/login/forget.vue")
    }
  ]
})

export default router
