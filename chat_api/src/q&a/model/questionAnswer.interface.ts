export interface ResponseQuestionDataInterface {
  question: {
    id: string;
    title: string;
  };
  answers: AnswerType[];
}

type AnswerType = {
  id: string;
  isAccept: boolean;
  content: string;
};
