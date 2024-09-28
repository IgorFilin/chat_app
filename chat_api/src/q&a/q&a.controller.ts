import { Controller, Get, Post, Body, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { QuestionAnswerService } from './q&a.service';
import { CreateQuestionDto } from './dto/createQuestion.dto';

@Controller('question-answer')
export class QuestionAnswerController {
  constructor(private readonly questionAnswerService: QuestionAnswerService) {}

  @Post('create')
  async create(@Body() body: CreateQuestionDto, @Res() res: Response, @Req() req: Request) {
    const result: any = await this.questionAnswerService.createQuestion(body, req.cookies.authToken);
    if (result) {
      return res.send(result);
    } else {
      return res.status(403).send(result);
    }
  }

  @Get('dataQuestions')
  async getNoteList(@Req() req: Request, @Res() res: Response) {
    const filter: any = req.query?.filter;
    const result = await this.questionAnswerService.getQuestions(filter);
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
