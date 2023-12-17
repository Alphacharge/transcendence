//router/index.js

import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import AboutView from "@/views/AboutView.vue";
import RemoteGameView from "@/views/RemoteGameView.vue";
import IpPanelView from "@/views/IpPanelView.vue";
import LoginView from "@/views/LoginView.vue";
import LogoutView from "@/views/LogoutView.vue";
import SignupView from "@/views/SignupView.vue";
import TournamentView from "@/views/TournamentView.vue";
import StatisticView from "@/views/StatisticView.vue";
import ProfileView from "@/views/ProfileView.vue";
import LocalGame from "@/views/LocalGameView.vue";
import RedirectView from "@/views/RedirectView.vue";
import ErrorView from "@/views/ErrorView.vue";
import { checkLoggedIn } from "@/services/authService";
import TwoFactorCodeView from "@/views/TwoFactorCodeView";
import TwoFactorEnableView from "@/views/TwoFactorEnableView";
import ChangePasswordView from "@/views/ChangePasswordView";

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
    path: "/remotegame",
    name: "remote game",
    component: RemoteGameView,
  },
  {
    path: "/localgame",
    name: "local game",
    component: LocalGame,
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
    path: "/logout",
    name: "logout",
    component: LogoutView,
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
    path: "/2fa-code",
    name: "2fa-code",
    component: TwoFactorCodeView,
  },
  {
    path: "/2fa-enable",
    name: "2fa-enable",
    component: TwoFactorEnableView,
  },
  {
    path: "/redirect",
    name: "redirect",
    component: RedirectView,
  },
  {
    path: "/changepassword",
    name: "changepassword",
    component: ChangePasswordView,
  },
  {
    path: "/error/:code",
    name: "error",
    component: ErrorView,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Global navigation guard to check for authentication
router.beforeEach(async (to, from, next) => {
  // check authorization
  try {
    const isLoggedIn = await checkLoggedIn();

    if (
      to.name !== "login" &&
      to.name !== "signup" &&
      to.name !== "2fa-code" &&
      to.name !== "ip" &&
      to.name !== "redirect" &&
      to.name !== "error" &&
      !isLoggedIn
    ) {
      next("/login");
    } else {
      next(); // Proceed to the requested route
    }
  } catch (error) {
    console.error("Error checking authentication:", error);
    next("/login");
  }
});

export default router;
