export interface IRegistrationBody {
  name: string;
  password: string;
  email: string;
}

export interface ILoginBody {
  email: string;
  password: string;
}

export interface IConfirm {
  key: string;
}
