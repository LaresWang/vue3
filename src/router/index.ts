import { createRouter, createWebHistory } from "vue-router"
// import TestView from "../views/TestView.vue"
// import Login from "../views/login/index.vue"
// import Set from "../views/user/set.vue"

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
      component: () => import("../views/TestView.vue")
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
      component: () => import("../views/login/index.vue")
    },
    {
      path: "/forgetPassword",
      name: "forgetpwd",
      component: () => import("../views/login/forget.vue")
    },
    {
      path: "/agreement",
      name: "agreement",
      component: () => import("../views/login/agreement.vue")
    },
    {
      path: "/human",
      name: "human",
      component: () => import("../views/human/index.vue"),
      children: [
        {
          path: "home",
          name: "humanhome",
          component: () => import("../views/human/home.vue")
        }
      ]
    },
    {
      path: "/user",
      name: "user",
      component: () => import("../views/user/index.vue"),
      children: [
        {
          path: "set",
          name: "set",
          component: () => import("../views/user/set.vue")
        }
      ]
    }
  ]
})

export default router
