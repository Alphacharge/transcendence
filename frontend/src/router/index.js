//router/index.js

import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import AboutView from "@/views/AboutView.vue";
import PongView from "@/views/PongView.vue";
import IpPanelView from "@/views/IpPanelView.vue";
import LoginView from "@/views/LoginView.vue";
import SignupView from "@/views/SignupView.vue";
import TournamentView from "@/views/TournamentView.vue";
import StatisticView from "@/views/StatisticView.vue";
import { checkLoggedIn } from "@/services/authService";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
  },
  {
    path: "/pong",
    name: "pong",
    component: PongView,
  },
  {
    path: "/ip",
    name: "ip",
    component: IpPanelView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/statistic",
    name: "statistic",
    component: StatisticView,
  },
  {
    path: "/signup",
    name: "signup",
    component: SignupView,
  },
  {
    path: "/tournament",
    name: "torunament",
    component: TournamentView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Global navigation guard to check for authentication
router.beforeEach((to, from, next) => {
  const isLoggedIn = checkLoggedIn();

  if (to.name !== 'login' && !isLoggedIn) {
    next('/login');
  } else {
    next(); // Proceed to the requested route
  }
});

export default router;
