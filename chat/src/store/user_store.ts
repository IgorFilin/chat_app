import { defineStore } from "pinia";
import { userApi } from "@/api/appApi";
import { useToast } from "vue-toastification";
import { errorStore } from "@/utils/storeError";

interface UserStoreType {
  users: Array<{}>;
  messages: string;
}

const toast = useToast();

export const useUserStore: any = defineStore("user_store", {
  state: () => {
    return {
      users: [],
      messages: "",
    } as UserStoreType;
  },
  getters: {},
  actions: {
    async getAllUsers() {
      try {
        const result = await userApi.getAllUsers();
        this.users = result.data;
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
