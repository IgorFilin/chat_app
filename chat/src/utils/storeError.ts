import axios, { AxiosError } from "axios";

export function errorStore(error: any) {
  if (axios.isAxiosError(error) && error.response) {
    const err = error as AxiosError<{ message: string }>;
    if (err.response) {
      let messages = Array.isArray(err.response?.data.message)
        ? err.response?.data.message[0]
        : err.response?.data.message;
      return messages;
    }
    return err;
  }
}
