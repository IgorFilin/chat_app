import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionAnswerService {
  constructor(
    @InjectRepository(User)
    private UserTable: Repository<User>,
    @InjectRepository(Question)
    private QuestionTable: Repository<Question>
  ) {}

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

  async createNote(body: any, token: string) {
    //   try {
    //     const user = await this.UserTable.findOneBy({ authToken: token });
    //     if (!user) {
    //       return {
    //         error: 'User not found',
    //         message: 'Invalid authentication token',
    //       };
    //     }
    //     const note = new Note();
    //     note.title = body.title;
    //     note.description = body.description;
    //     note.user = user;
    //     const savedNote = await this.NoteTable.save(note);
    //     return {
    //       note: {
    //         id: savedNote.id,
    //         title: savedNote.title,
    //         description: savedNote.description,
    //         date: savedNote.date,
    //       },
    //     };
    //   } catch (e) {
    //     console.error('Error creating note:', e);
    //     return {
    //       error: 'Error creating note',
    //       message: e.message,
    //     };
    //   }
  }
}
