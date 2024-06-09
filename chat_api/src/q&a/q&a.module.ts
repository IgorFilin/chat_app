import { Module } from '@nestjs/common';
import { QuestionAnswerService } from './q&a.service';
import { QuestionAnswerController } from './q&a.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Question } from './entities/question.entity';
import { Answer } from './entities/answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Answer, Question])],
  controllers: [QuestionAnswerController],
  providers: [QuestionAnswerService],
})
export class QuestionAnswerModule {}
