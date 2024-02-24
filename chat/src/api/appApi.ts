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

const authInstance = axios.create({
  baseURL: `http://${import.meta.env.VITE_APP_DOMEN_PORT}`,
  withCredentials: true,
  credentials: 'include',
} as any);

const geolocationInstance = axios.create({
  baseURL: 'https://ipapi.co',
});

export const authApi = {
  registerUser(userData: RegisterUserType) {
    return authInstance.post<ResponseRegisterUserType>('/user/registration', userData);
  },
  loginUser(userData: LoginUserType) {
    return authInstance.post<ResponseLoginType>('/user/login', userData);
  },
  auth() {
    return authInstance.get('user/auth');
  },
  logout() {
    return authInstance.get<ResponseLogoutType>('user/logout');
  },
  confirmReg(key: string) {
    return authInstance.get<ResponseConfirmRegType>('user/confirm', {
      params: { key },
    });
  },
  getPhoto() {
    return authInstance.get('user/avatar', { responseType: 'blob' });
  },
  setPhoto(id: string, formdata: any) {
    return authInstance.post(`user/avatar?id=${id}`, formdata, {
      headers: { 'Content-Type': 'multipart/form-data' },
      responseType: 'blob',
    });
  },
  repeatedConfirmReg(email: string) {
    return authInstance.get<ResponseConfirmRegType>('user/send_mail_confirm', { params: { email } });
  },
  executeYaCaptcha(userToken: string) {
    return authInstance.get(`user/validateCaptcha?token=${userToken}`);
  },
};
export const userApi = {
  getAllUsers() {
    return authInstance.get<Array<ResponseGetAllUsersType>>('user/users_list');
  },
};

export const geolocationDataUser = {
  getGeolocationData(ip: string) {
    return geolocationInstance.get(`${ip}/json/`);
  },
};
