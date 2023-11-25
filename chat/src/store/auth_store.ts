import { defineStore } from "pinia";
import { authApi } from "@/api/appApi";
import { LoginUserType } from "@/api/typesApi";
import { useToast } from "vue-toastification";
import { dataRegisterUser } from "@/api/typesApi";
import { errorStore } from "@/utils/storeError";

interface UserType {
  name: string;
  isAdmin: boolean | null;
  isAuth: boolean;
  messages: string;
  confirmReg: boolean;
  id: string;
  isLoading: boolean;
  userPhoto: any;
}

const toast = useToast();

export const useAuthStore: any = defineStore("auth_store", {
  state: () => {
    return {
      name: "",
      isAdmin: null,
      isAuth: false,
      confirmReg: false,
      messages: "" as string | undefined,
      isLoading: false,
      id: "",
      userPhoto: "",
    } as UserType;
  },
  getters: {},
  actions: {
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
    async registration(dataUser: dataRegisterUser) {
      try {
        this.isLoading = true;
        const result = await authApi.registerUser(dataUser);
        this.confirmReg = result.data.isRegConfirm;
        this.messages = result.data.message;
      } catch (error) {
        errorStore(error);
      } finally {
        this.isLoading = false;
        toast(this.messages);
        this.messages = "";
      }
    },
    async auth() {
      try {
        this.isLoading = true;
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
        this.name = "";
        toast("Вы успешно вышли, возвращайтесь!");
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
        this.name = result.data.name;
        this.messages = result.data.message;
        await this.auth();
      } catch (error) {
        this.messages = errorStore(error);
      } finally {
        this.isLoading = false;
        toast(this.messages);
        this.messages = "";
      }
    },
    async sendAvatarUser(file: any) {
      try {
        const formDataFile = new FormData();
        formDataFile.append("avatar", file);
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
