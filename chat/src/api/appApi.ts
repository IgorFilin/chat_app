import axios, { AxiosResponse } from 'axios';
import {
  LoginUserType,
  RegisterUserType,
  ResponseConfirmRegType,
  ResponseGetAllUsersType,
  ResponseLoginType,
  ResponseLogoutType,
  ResponseRegisterUserType,
} from '../types/typesApi';

const mainInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_HOST,
  withCredentials: true,
  credentials: 'include',
} as any);

const geolocationInstance = axios.create({
  baseURL: 'https://ipapi.co',
});

export const authApi = {
  registerUser(userData: RegisterUserType) {
    return mainInstance.post<ResponseRegisterUserType>('/user/registration', userData);
  },
  loginUser(userData: LoginUserType) {
    return mainInstance.post<ResponseLoginType>('/user/login', userData);
  },
  auth() {
    return mainInstance.get('/user/auth');
  },
  logout() {
    return mainInstance.get<ResponseLogoutType>('/user/logout');
  },
  confirmReg(key: string) {
    return mainInstance.get<ResponseConfirmRegType>('/user/confirm', {
      params: { key },
    });
  },
  confirmKeyRestorePass(restoreData: { key: string; password: string }) {
    return mainInstance.post('user/confirmKeyRestorePass', restoreData);
  },

  getPhoto() {
    return mainInstance.get('/user/avatar');
  },
  setPhoto(id: string, formdata: any) {
    return mainInstance.post(`/user/avatar?id=${id}`, formdata, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  repeatedConfirmReg(email: string) {
    return mainInstance.get<ResponseConfirmRegType>('/user/send_mail_confirm', { params: { email } });
  },
  executeYaCaptcha(userToken: string) {
    return mainInstance.get(`/user/validateCaptcha?token=${userToken}`);
  },
};

export const userApi = {
  getAllUsers() {
    return mainInstance.get<Array<ResponseGetAllUsersType>>('/user/users_list');
  },
};

export const geolocationDataUser = {
  getGeolocationData(ip: string) {
    return geolocationInstance.get(`${ip}/json/`);
  },
};

export const yandexDiskApi = {
  getRecource(queryObj: any) {
    console.log(queryObj);
    return mainInstance.get(`ya_disk/get_resourse/`, { params: queryObj });
  },
};
