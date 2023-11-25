import { createRouter, createWebHistory } from "vue-router";
import RegistrationPage from "../components/RegistrationPage.vue";
import LoginPage from "@/components/LoginPage.vue";
import MainPage from "@/components/MainPage.vue";
import ConfirmRegistration from "@/components/ConfirmRegistration.vue";
import { useAuthStore } from "@/store/auth_store";

const routes = [
  { path: "/registration", component: RegistrationPage },
  { path: "/login", component: LoginPage },
  { path: "/main", component: MainPage },
  { path: "/confirm", component: ConfirmRegistration },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const store = useAuthStore();

  if (!store.isAuth && to.path === "/main") {
    next({ path: "/login" });
  } else if (to.path === "/") {
    next({ path: "/main" });
  } else if (store.isAuth && to.path !== "/main") {
    next({ path: "/main" });
  } else if (store.isAuth && to.path == "/login") {
    next({ path: "/main" });
  } else {
    next();
  }
});

export default router;
