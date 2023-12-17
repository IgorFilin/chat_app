import { defineStore } from 'pinia';
import { authApi } from '@/api/appApi';
import { LoginUserType, RegisterUserType } from '@/types/typesApi';
import { useToast } from 'vue-toastification';
import { errorStore } from '@/utils/storeError';
import router from '@/router/router';

interface UserType {
  name: string;
  isAuth: boolean;
  messages: any;
  isAcceptKey: boolean | null;
  id: string;
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
        this.isLoading = true;
        const result = await authApi.loginUser(data);
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
          // @ts-ignore
          JSON.stringify(localStorage.setItem('isAcceptKey', result.data.isAcceptKey));
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
        this.isLoading = true;
        // @ts-ignore
        this.isAcceptKey = JSON.parse(localStorage.getItem('isAcceptKey'));
        const result = await authApi.auth();
        this.isAuth = result.data.isAuth;
        this.name = result.data.name;
        this.id = result.data.id;
        this.getAvatar();
      } catch (error) {
        this.messages = errorStore(error);
      } finally {
        this.isLoading = false;
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
    toast(message: string) {
      toast(message);
    },
  },
});
