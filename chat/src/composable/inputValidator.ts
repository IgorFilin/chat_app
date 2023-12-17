import { ref, onMounted, onUnmounted } from 'vue';

export enum TypeInputType {
  text = 'text',
  password = 'password',
  email = 'email',
}

type InputValidatorResponseType =
  | {
      error?: string;
      text?: string;
      email?: string;
      password?: string;
    }
  | '';

export function inputValidator(data: string, inputType: TypeInputType): InputValidatorResponseType {
  switch (inputType) {
    case TypeInputType.text: {
      if (!/^[A-zА-яё 0-9-]+$/.test(data) || data.length >= 15) {
        return {
          text: data,
          error: 'Некорректное имя',
        };
      }
      return {
        text: data,
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
    default: {
      return '';
    }
  }
}
