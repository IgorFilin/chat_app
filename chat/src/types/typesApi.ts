export interface LoginUserType {
  email: string;
  password: string | number;
}

export interface RegisterUserType {
  name: string;
  email: string;
  password: string;
}

export interface ResponseLoginType {
  message: string;
  name: string;
  isAuth: boolean;
  id: string;
}

export interface ResponseLogoutType {
  isAuth: boolean;
}

export interface ResponseConfirmRegType {
  message: string;
  isAcceptKey: boolean;
}

export interface ResponseRegisterUserType {
  isAcceptKey: boolean;
  message: string;
}

export interface ResponseGetAllUsersType {
  id: string;
  name: string;
}
