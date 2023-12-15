import { ref, onMounted, onUnmounted } from 'vue';

export enum TypeInputType {
  text = 'text',
  password = 'password',
  email = 'email',
}

export function inputValidator(data: string, inputType: TypeInputType): { error: string } | { text: string } | '' {
  const inputValue = data;

  switch (inputType) {
    case TypeInputType.text: {
      if (inputValue.length >= 2) {
        return {
          text: inputValue,
          error: 'Имя должно иметь меньше 15 символов',
        };
      }
      return {
        text: inputValue,
      };
    }
    default: {
      return '';
    }
  }

  // if (inputType === TypeInputType.text) {

  //   return (inputValue.value += 'TEXT');
  // }
}
