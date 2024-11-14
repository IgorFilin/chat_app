import {
  Component,
  effect,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { QuestionAnswerService } from '../../services/question-answer.service';
import { CommonModule } from '@angular/common';
import { TECHNOLOGY_STACK } from '../../models/constants';
import { TechnologyStackType } from '../../models/types';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  standalone: true,
  selector: 'app-knowledgeBase',
  templateUrl: './knowledgeBase.component.html',
  imports: [CommonModule, MarkdownModule],
  styleUrls: ['./knowledgeBase.component.scss'],
})
export class KnowledgeBaseComponent implements OnInit {

  dataArticles: any = [];
  techologies: TechnologyStackType[] = TECHNOLOGY_STACK;
  currentTech: WritableSignal<TechnologyStackType> = signal('Angular');

  constructor(private questionAnswerService: QuestionAnswerService) {
    effect(() => {
      this.questionAnswerService
        .getArticles(this.currentTech())
        .subscribe((data) => {
          console.log('data', data);
          this.dataArticles = data;
        });
    });
  }

  ngOnInit() {}

  onClickTechTagHandler(tech: TechnologyStackType) {
    this.currentTech.set(tech);
  }

  listenArticle(id: string) {
    this.questionAnswerService.getArticle(id).subscribe((data) => {
      console.log(data);
    })
  }
}
