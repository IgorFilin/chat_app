import { Controller, Get, Post, Body, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { QuestionAnswerService } from './q&a.service';

@Controller('question-answer')
export class QuestionAnswerController {
  constructor(private readonly questionAnswerService: QuestionAnswerService) {}

  @Post('create')
  async create(@Body() body: any, @Res() res: Response, @Req() req: Request) {
    console.log(body);
    // const result: any = await this.noteService.createNote(createNoteDto, req.cookies.authToken);
    // if (result.note) {
    //   return res.send(result);
    // } else {
    //   return res.status(403).send(result);
    // }
  }

  @Get('test')
  async getNoteList(@Req() req: Request, @Res() res: Response) {
    console.log('test');
    // const result = await this.noteService.getNotes(req.cookies.authToken);
    // return res.send(result);
    return res.send(200);
  }

  @Post('deleteNote')
  async deleteNote(@Body() body: { id: string }, @Req() req: Request, @Res() res: Response) {
    // const result = await this.noteService.deleteNote(body.id, req.cookies.authToken);
    // if (result.id) {
    //   return res.send(result);
    // } else {
    //   return res.status(403).send(result);
    // }
  }
}
