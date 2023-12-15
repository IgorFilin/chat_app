import { ref, onMounted, onUnmounted } from 'vue';

export enum TypeInputType {
  text = 'text',
  password = 'password',
  email = 'email',
}

export function inputValidator(data: string, inputType: TypeInputType): { error: string } | { text: string } | '' {
  console.log(!/^[a-zА-яё 0-9-]+$/.test(data));
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
    default: {
      return '';
    }
  }

  // if (inputType === TypeInputType.text) {

  //   return (inputValue.value += 'TEXT');
  // }
}
