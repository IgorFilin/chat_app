import { Controller, Get, Post, Body, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { LearningCenterService } from './learning-center.service';
import { CreateQuestionDto } from './dto/createQuestion.dto';
import { CreateArticleDto } from './dto/createArticle.dto';

@Controller('learning')
export class LearningCenterController {
  constructor(private readonly learningCenterService: LearningCenterService) {}

  @Post('create-question')
  async createQuestion(@Body() body: CreateQuestionDto, @Res() res: Response, @Req() req: Request) {
    const result: any = await this.learningCenterService.createQuestion(body, req.cookies.authToken);
    if (result) {
      return res.send(result);
    } else {
      return res.status(403).send(result);
    }
  }

  @Get('questions')
  async getNoteList(@Req() req: Request, @Res() res: Response) {
    const filter: any = req.query?.filter;
    const result = await this.learningCenterService.getQuestions(filter);
    if (result) {
      return res.send(result);
    } else {
      return res.status(403).send(result);
    }
  }

  @Post('create-article')
  async createArticle(@Body() body: CreateArticleDto, @Res() res: Response, @Req() req: Request) {
    console.log('asd');
    const result: any = await this.learningCenterService.createArticle(body, req.cookies.authToken);
    if (result) {
      return res.send(result);
    } else {
      return res.status(403).send(result);
    }
  }

  @Get('articles')
  async getArticles( @Res() res: Response, @Req() req: Request) {
    const filter: any = req.query?.filter || 'all';
    const result = await this.learningCenterService.getArticles(filter);
    if (result) {
      return res.send(result);
    } else {
      return res.status(403).send(result);
    }
  }

  @Get('article')
  async getArticle( @Res() res: Response, @Req() req: Request) {
    const authToken = req.cookies.authToken;
    const id: any = req.query?.id;
    const result = await this.learningCenterService.getArticle(id, authToken);
    if (result) {
      return res.send(result);
    } else {
      return res.status(403).send(result);
    }
  }

  @Get('tags')
  async getTags(@Res() res: Response, @Req() req: Request) {
    const filter: any = req.query?.filter
    const isAll: any = req.query?.isAll
    const result = await this.learningCenterService.getTags(filter, isAll);
    if (result) {
      return res.send(result);
    } else {
      return res.status(403).send(result);
    }
  }
}
