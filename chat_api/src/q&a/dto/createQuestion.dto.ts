import { MinLength, IsString, Validate } from 'class-validator';
import { IQuestionDto, ThemeType } from '../model/questionAnswer.interface';

export class CreateQuestionDto {
  answers: Array<IQuestionDto>;
  question: string;
  description?: string;
  theme: ThemeType;
}
export class AppModule {}
