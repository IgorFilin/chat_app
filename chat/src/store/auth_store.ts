import { defineStore } from 'pinia';
import { authApi } from '@/api/appApi';
import { LoginUserType, RegisterUserType } from '@/types/typesApi';
import { geolocationDataUser } from '@/api/appApi.ts';
import { useToast } from 'vue-toastification';
import { errorStore } from '@/utils/storeError';
import { useSocketStore } from '@/store/socket_store.ts';
import router from '@/router/router';
interface UserType {
  name: string;
  isAuth: boolean;
  messages: any;
  isAcceptKey: boolean | null;
  id: string;
  socketConnected: boolean;
  email: string;
  isLoading: boolean;
  userPhoto: any;
  currentPath: string;
}

const toast = useToast();

export const useAuthStore: any = defineStore('auth_store', {
  state: () => {
    return {
      name: '',
      isAuth: false,
      isAcceptKey: null,
      messages: '',
      email: '',
      isLoading: false,
      id: '',
      userPhoto: '',
      currentPath: '',
    } as UserType;
  },
  getters: {
    getPath(state) {
      return state.currentPath;
    },
  },
  actions: {
    setPath(path: string) {
      this.currentPath = path;
    },
    async loginAction(data: LoginUserType) {
      try {
        const socketStore = useSocketStore();
        this.isLoading = true;
        const result = await authApi.loginUser(data);
        await socketStore.connectSocket(result.data.id);
        this.messages = result.data.message;
        this.name = result.data.name;
        this.isAuth = result.data.isAuth;
        this.id = result.data.id;
        this.getAvatar();
      } catch (error) {
        this.messages = errorStore(error);
      } finally {
        this.isLoading = false;
        toast(this.messages);
      }
    },
    async registration(dataUser: RegisterUserType) {
      try {
        this.isLoading = true;
        const result = await authApi.registerUser(dataUser);
        if (typeof result.data.isAcceptKey !== 'undefined') {
          this.isAcceptKey = result.data.isAcceptKey;
          this.email = result.data.email;
          // @ts-ignore
          localStorage.setItem('isAcceptKey', result.data.isAcceptKey);
          localStorage.setItem('email', result.data.email);
        }
        this.messages = result.data.message;
        router.push('/confirm');
      } catch (error) {
        this.messages = errorStore(error);
      } finally {
        this.isLoading = false;
        toast(this.messages);
        this.messages = '';
      }
    },
    async auth() {
      try {
        const socketStore = useSocketStore();
        this.isLoading = true;
        const result = await authApi.auth();
        await socketStore.connectSocket(result.data.id);
        this.isAuth = result.data.isAuth;
        this.name = result.data.name;
        this.id = result.data.id;
        this.isAcceptKey = result.data.isAcceptKey;
        this.getAvatar();
      } catch (error) {
        this.messages = errorStore(error);
      } finally {
        this.isLoading = false;
        if (this.isAcceptKey && !!localStorage.getItem('isAcceptKey')) {
          localStorage.setItem('isAcceptKey', 'true');
        } else {
          this.isAcceptKey = !localStorage.getItem('isAcceptKey');
        }
      }
    },
    async geolocation(ip: string) {
      try {
        return await geolocationDataUser.getGeolocationData(ip);
      } catch (error) {
        this.messages = errorStore(error);
      }
    },
    async getAvatar() {
      try {
        const resultImage = await authApi.getPhoto();
        const blob = new Blob([resultImage.data]);
        const imageSrc = URL.createObjectURL(blob);
        this.userPhoto = imageSrc;
      } catch (error) {
        this.messages = errorStore(error);
      }
    },
    async logout() {
      try {
        this.isLoading = true;
        const result = await authApi.logout();
        this.isAuth = result.data.isAuth;
        this.name = '';
        localStorage.removeItem('isAcceptKey');
        toast('Вы успешно вышли, возвращайтесь!');
      } catch (error) {
        this.messages = errorStore(error);
      } finally {
        this.isLoading = false;
      }
    },
    async confirmRegistration(key: string) {
      try {
        this.isLoading = true;
        const result = await authApi.confirmReg(key);
        this.messages = result.data.message;
        // @ts-ignore
        localStorage.setItem('isAcceptKey', result.data.isAcceptKey);
        localStorage.removeItem('email');
        await this.auth();
      } catch (error) {
        this.messages = errorStore(error);
      } finally {
        this.isLoading = false;
        toast(this.messages);
        this.messages = '';
      }
    },
    async sendAvatarUser(file: any) {
      try {
        const formDataFile = new FormData();
        formDataFile.append('avatar', file);
        const result = await authApi.setPhoto(this.id, formDataFile);
        if (this.userPhoto) {
          URL.revokeObjectURL(this.userPhoto);
        }
        const blob = new Blob([result.data]);
        const imageSrc = URL.createObjectURL(blob);
        this.userPhoto = imageSrc;
      } catch (error) {
        this.messages = errorStore(error);
        toast(this.messages);
      }
    },
    async confirmSendMailMessage(email: string, type: 'reg' | 'pass' = 'reg') {
      try {
        const result = await authApi.mailConfirm(email, type);
        this.messages = result.data.message;
      } catch (error) {
        this.messages = errorStore(error);
      } finally {
        this.isLoading = false;
        toast(this.messages);
        this.messages = '';
      }
    },
    async confirmKeyRestorePass(key: string) {
      try {
        const result = await authApi.confirmKeyRestorePass(key);
        this.messages = result.data.message;
      } catch (error) {
        this.messages = errorStore(error);
      } finally {
        this.isLoading = false;
        toast(this.messages);
        this.messages = '';
      }
    },
    toast(message: string) {
      toast(message);
    },
  },
});
