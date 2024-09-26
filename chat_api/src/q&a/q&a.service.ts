import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Question } from './entities/question.entity';
import { Answer } from './entities/answer.entity';
import { CreateQuestionDto } from './dto/createQuestion.dto';

@Injectable()
export class QuestionAnswerService {
  constructor(
    @InjectRepository(User)
    private UserTable: Repository<User>,
    @InjectRepository(Question)
    private QuestionTable: Repository<Question>,
    @InjectRepository(Answer)
    private AnswerTable: Repository<Answer>
  ) {}

  async createQuestion(body: CreateQuestionDto, token: string) {
    try {
      const user = await this.UserTable.findOneBy({ authToken: token });
      if (!user) {
        return {
          message: 'Пользователь не найден',
        };
      }
      const question = new Question();
      question.title = body.question;
      question.theme = body.theme;
      question.description = body.description ?? '';
      question.user = user;
      const savedQuestion = await this.QuestionTable.save(question);

      for (const requestAnswer of body.answers) {
        const newAnswer = new Answer();
        newAnswer.title = requestAnswer.value;
        newAnswer.question = savedQuestion;
        newAnswer.isCorrect = requestAnswer.accept;
        await this.AnswerTable.save(newAnswer);
      }
      return {
        message: 'Вопрос успешно создан',
      };
    } catch (e) {
      return {
        error: 'Ошибка создания вопроса',
        message: e.message,
      };
    }
  }

  async getQuestions() {
    let responseQuestionData = [];

    try {
      const questions = await this.QuestionTable.find({
        relations: ['answer'],
      });
      console.log(questions);
      return {
        message: 'Вопросы получены',
        data: questions,
      };
    } catch (e) {
      return {
        error: 'Ошибка получения вопросов',
        message: e.message,
      };
    }

    return responseQuestionData;
  }

  async deleteNote(id: string, token: string) {
    // try {
    //   const { notes } = await this.UserTable.findOne({
    //     where: { authToken: token },
    //     relations: ['notes'],
    //   });
    //   if (!notes) {
    //     return {
    //       message: 'Пользователь не найден',
    //     };
    //   }
    //   const currentNote = notes.find((note) => note.id === id);
    //   if (!currentNote) {
    //     return {
    //       message: 'Запись не найдена',
    //     };
    //   }
    //   await this.NoteTable.remove(currentNote);
    //   return {
    //     id,
    //   };
    // } catch (e) {
    //   return {
    //     message: 'Произошла ошибка, запись не удалена',
    //   };
    // }
  }
}
