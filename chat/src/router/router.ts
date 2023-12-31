import { createRouter, createWebHistory } from 'vue-router';
import RegistrationPage from '../components/RegistrationPage.vue';
import LoginPage from '@/components/LoginPage.vue';
import MainPage from '@/components/MainPage.vue';
import ConfirmRegistration from '@/components/ConfirmRegistration.vue';
import ProfilePage from '@/components/ProfilePage.vue';
import Test from '@/components/Test.vue';
import { useAuthStore } from '@/store/auth_store';

const routes = [
  { path: '/registration', component: RegistrationPage },
  { path: '/login', component: LoginPage },
  { path: '/main', component: MainPage },
  { path: '/confirm', component: ConfirmRegistration },
  { path: '/test', component: Test },
  { path: '/profile', component: ProfilePage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const store = useAuthStore();
  store.setPath(to.fullPath);

  if (!store.isAuth && to.path === '/main') {
    next({ path: '/login' });
  } else if (to.path === '/') {
    next({ path: '/main' });
  } else {
    next();
  }
});

export default router;
