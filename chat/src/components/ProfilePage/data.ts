import { useAuthStore } from '@/store/auth_store.ts';

const authStore = useAuthStore();

export const firstText = `-- Подключаемся под пользователем --

setUserAgent('${authStore.name}')

...............................

`;

export default {};
