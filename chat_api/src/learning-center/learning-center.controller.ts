import { Controller, Get, Post, Body, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { LearningCenterService } from './learning-center.service';
import { CreateQuestionDto } from './dto/createQuestion.dto';

@Controller('learning')
export class LearningCenterController {
  constructor(private readonly learningCenterService: LearningCenterService) {}

  @Post('create-question')
  async create(@Body() body: CreateQuestionDto, @Res() res: Response, @Req() req: Request) {
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

  @Post('tet')
  async deleteNote(@Body() body: { id: string }, @Req() req: Request, @Res() res: Response) {
    // const result = await this.noteService.deleteNote(body.id, req.cookies.authToken);
    // if (result.id) {
    //   return res.send(result);
    // } else {
    //   return res.status(403).send(result);
    // }
  }
}
