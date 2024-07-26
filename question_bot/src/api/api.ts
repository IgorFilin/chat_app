import axios from 'axios';

const mainInstance = axios.create({
  baseURL: process.env.URL || 'https://filin-hub.online',
  withCredentials: true,
});

export const apiBot = {
  getQuestions() {
    return mainInstance.get('question-answer/dataQuestions/');
  },
};
