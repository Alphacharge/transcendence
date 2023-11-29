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
import ProfileView from "@/views/ProfileView.vue";
import RedirectView from "@/views/RedirectView.vue";
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
    path: "/profile",
    name: "profile",
    component: ProfileView,
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
  {
    path: "/redirect",
    name: "redirect",
    component: RedirectView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Global navigation guard to check for authentication
router.beforeEach(async (to, from, next) => {
  try {
    const isLoggedIn = await checkLoggedIn();
    if (
      to.name !== "login" &&
      to.name !== "signup" &&
      to.name !== "ip" &&
      to.name !== "redirect" &&
      !isLoggedIn
    )
    {
        next("/login");
    }
    else {
      next(); // Proceed to the requested route
    }
  } catch (error) {
    console.error("Error checking authentication:", error);
    next("/login");
  }
});

export default router;
