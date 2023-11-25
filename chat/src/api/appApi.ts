import axios, { AxiosResponse } from "axios";
import {
  LoginUserType,
  RegisterUserType,
  ResponseConfirmRegType,
  ResponseGetAllUsersType,
  ResponseLoginType,
  ResponseLogoutType,
  ResponseRegisterUserType,
} from "./typesApi";

const instance = axios.create({
  baseURL: `http://${import.meta.env.VITE_APP_DOMEN_PORT}`,
  withCredentials: true,
  credentials: "include",
} as any);

export const authApi = {
  registerUser(userData: RegisterUserType) {
    return instance.post<ResponseRegisterUserType>(
      "/user/registration",
      userData
    );
  },
  loginUser(userData: LoginUserType) {
    return instance.post<ResponseLoginType>("/user/login", userData);
  },
  auth() {
    return instance.get("user/auth");
  },
  logout() {
    return instance.get<ResponseLogoutType>("user/logout");
  },
  confirmReg(key: string) {
    return instance.get<ResponseConfirmRegType>("user/confirm", {
      params: { key },
    });
  },
  getPhoto() {
    return instance.get("user/avatar", { responseType: "blob" });
  },
  setPhoto(id: string, formdata: any) {
    return instance.post(`user/avatar?id=${id}`, formdata, {
      headers: { "Content-Type": "multipart/form-data" },
      responseType: "blob",
    });
  },
};

export const userApi = {
  getAllUsers() {
    return instance.get<Array<ResponseGetAllUsersType>>("user/users_list");
  },
};
