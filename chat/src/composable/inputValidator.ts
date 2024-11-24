import { ref, onMounted, onUnmounted } from 'vue';

export enum TypeInputType {
  name = 'name',
  password = 'password',
  email = 'email',
  code = 'code',
}

type InputValidatorResponseType =
  | {
      error?: string;
      name?: string;
      email?: string;
      password?: string;
    }
  | '';

export function inputValidator(data: string, inputType: TypeInputType): InputValidatorResponseType {
  switch (inputType) {
    case TypeInputType.name: {
      if (!/^[A-zА-яё 0-9-]+$/.test(data) || data.length >= 15) {
        return {
          name: data,
          error: 'Некорректное имя',
        };
      }
      return {
        name: data,
      };
    }
    case TypeInputType.email: {
      if (!/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu.test(data)) {
        return {
          email: data,
          error: 'Некорректная почта',
        };
      }
      return {
        email: data,
      };
    }
    case TypeInputType.password: {
      if (data.length < 7) {
        return {
          password: data,
          error: 'Некорректный пароль',
        };
      }
      return {
        password: data,
      };
    }
    case TypeInputType.code: {
      if (data.length === 0) {
        return {
          password: data,
          error: 'Некорректный проверочный код',
        };
      }
      return {
        password: data,
      };
    }
    default: {
      return '';
    }
  }
}
