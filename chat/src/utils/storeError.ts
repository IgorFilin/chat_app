import axios, { AxiosError } from 'axios';

export function errorStore(error: any) {
  if (axios.isAxiosError(error) && error.response) {
    const err = error as AxiosError<{ message: string }>;
    if (err.response) {
      let messages = '';
      if (Array.isArray(err.response?.data.message)) {
        err.response?.data.message.forEach((message) => {
          messages += message + '\n';
        });
      } else {
        messages = err.response?.data.message;
      }
      return messages;
    }
    return err;
  }
}
