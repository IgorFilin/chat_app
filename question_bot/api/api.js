import axios from 'axios';

const mainInstance = axios.create({
  baseURL: process.env.URL,
  withCredentials: true,
  credentials: 'include',
});

export const apiBot = {
  getQuestions() {
    return mainInstance.get('question-answer/dataQuestions/');
  },
};
