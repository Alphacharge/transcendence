import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import AboutView from "@/views/AboutView.vue";
import PongView from "@/views/PongView.vue";
import LoginFieldsView from "@/views/LoginFieldsView.vue";
import IpPanelView from "@/views/IpPanelView.vue";

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
    path: "/login",
    name: "login",
    component: LoginFieldsView,
  },
  {
    path: "/ip",
    name: "ip",
    component: IpPanelView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
