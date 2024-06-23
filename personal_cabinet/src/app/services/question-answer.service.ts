import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { Observable } from 'rxjs';
import { CreateQuestionFormType } from '../components/questions-bot/questions-bot.component';
import { ToasterService } from './toaster.service';

@Injectable({
  providedIn: 'root',
})
export class QuestionAnswerService {
  constructor(
    private requestServise: RequestService,
    private toastService: ToasterService
  ) {}

  addQuestion$(payload: CreateQuestionFormType) {
    this.requestServise
      .post('question-answer/create', payload)
      .subscribe((data) => {
        if (data.message) {
          this.toastService.info(data.message);
        }
      });
  }
}
