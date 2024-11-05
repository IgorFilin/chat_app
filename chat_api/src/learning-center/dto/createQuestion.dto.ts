import { IQuestionDto, ThemeType } from '../model/learning-center.interface';

export class CreateQuestionDto {
  answers: Array<IQuestionDto>;
  question: string;
  description?: string;
  theme: ThemeType;
}