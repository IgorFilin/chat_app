import { Component, OnInit } from '@angular/core';
import { QuestionAnswerService } from '../../services/question-answer.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-knowledgeBase',
  templateUrl: './knowledgeBase.component.html',
  imports: [CommonModule],
  styleUrls: ['./knowledgeBase.component.scss'],
})
export class KnowledgeBaseComponent implements OnInit {
  dataQuestions: any = [];

  constructor(private questionAnswerService: QuestionAnswerService) {}

  ngOnInit() {
    this.questionAnswerService.getQuestion$().subscribe((data) => {
      this.dataQuestions = data.data;
    });
  }
}
