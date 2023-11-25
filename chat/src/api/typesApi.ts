export interface LoginUserType {
  email: string;
  password: string | number;
}

export interface RegisterUserType {
  name: string;
  email: string;
  password: string | number;
}

export interface ResponseLoginType {
  message: string;
  name: string;
  isAuth: true;
  id: string;
}
export interface dataRegisterUser {
  name: string;
  email: string;
  password: string | number;
}

export interface ResponseLogoutType {
  isAuth: boolean;
}

export interface ResponseConfirmRegType {
  name: string;
  message: string;
  id: string;
}

export interface ResponseRegisterUserType {
  isRegConfirm: boolean;
  message: string;
}

export interface ResponseGetAllUsersType {
  id: string;
  name: string;
}
