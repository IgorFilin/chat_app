import axios from 'axios';

const mainInstance = axios.create({
  baseURL: process.env.URL || 'https://filin.tech/api/',
  withCredentials: true,
});

export const apiBot = {
  getQuestions() {
    const result = mainInstance.get('question-answer/dataQuestions/');
    return result;
  },
  login(requestData: { email: string; password: string }) {
    const result = mainInstance.post('user/login/', { email: requestData.email, password: requestData.password });
    return result;
  },
};
