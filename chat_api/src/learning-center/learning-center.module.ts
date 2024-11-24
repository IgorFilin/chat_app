import { Module } from '@nestjs/common';
import { LearningCenterService } from './learning-center.service';
import { LearningCenterController } from './learning-center.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Question } from './entities/question.entity';
import { Answer } from './entities/answer.entity';
import { Article } from './entities/article.entity';
import { Tags } from './entities/tags.entity';
import { Views } from './entities/views-article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Answer, Question, Article, Tags, Views])],
  controllers: [LearningCenterController],
  providers: [LearningCenterService],
})
export class LearningCenterModule {}
