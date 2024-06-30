import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Question } from './entities/question.entity';
import { Answer } from './entities/answer.entity';

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

  async createQuestion(body: Record<string, string>, token: string) {
    try {
      const user = await this.UserTable.findOneBy({ authToken: token });
      if (!user) {
        return {
          error: 'User not found',
          message: 'Invalid authentication token',
        };
      }
      const question = new Question();
      question.title = body.question;
      question.user = user;
      const savedQuestion = await this.QuestionTable.save(question);

      for (const key in body) {
        if (key.includes('answer')) {
          const answer = new Answer();
          answer.title = body[key];
          answer.question = savedQuestion;
          answer.isCorrect = body.acceptAnswer === key;
          await this.AnswerTable.save(answer);
        }
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

  async getNotes(token: string) {
    // const { notes } = await this.UserTable.findOne({
    //   where: { authToken: token },
    //   relations: ['notes'],
    // });
    // if (!notes) {
    //   return {
    //     message: 'Пользователь не найден',
    //   };
    // }
    // return {
    //   notes: notes.map((note) => ({
    //     id: note.id,
    //     title: note.title,
    //     description: note.description,
    //     date: note.date,
    //   })),
    // };
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
