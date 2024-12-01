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
import { Router, RouterModule, UrlSegment } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { TextSlicePipe } from '../../pipes/text-slice.pipe';

@Component({
  standalone: true,
  selector: 'app-knowledgeBase',
  templateUrl: './knowledgeBase.component.html',
  imports: [CommonModule, MarkdownModule, RouterModule, IconComponent, TextSlicePipe],
  styleUrls: ['./knowledgeBase.component.scss'],
})
export class KnowledgeBaseComponent implements OnInit {

  dataArticles: any = [];
  techologies: TechnologyStackType[] = TECHNOLOGY_STACK;
  // currentTech: WritableSignal<TechnologyStackType> = signal('');

  constructor(
    private questionAnswerService: QuestionAnswerService,
    private router: Router
  ) {
    // effect(() => {
   
    // });
  }

  ngOnInit() {
    this.questionAnswerService
    .getArticles()
    .subscribe((data) => {
      this.dataArticles = data;
    });
  }

  onClickTechTagHandler(tech: TechnologyStackType) {
    // this.currentTech.set(tech);
  }
}
