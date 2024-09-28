import {
  Component,
  effect,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { QuestionAnswerService } from '../../services/question-answer.service';
import { CommonModule } from '@angular/common';
import { TransformHtmlInCodePipe } from '../../pipes/transform-html-in-code.pipe';
import { TECHNOLOGY_STACK } from '../../models/constants';
import { TechnologyStackType } from '../../models/types';

@Component({
  standalone: true,
  selector: 'app-knowledgeBase',
  templateUrl: './knowledgeBase.component.html',
  imports: [CommonModule, TransformHtmlInCodePipe],
  styleUrls: ['./knowledgeBase.component.scss'],
})
export class KnowledgeBaseComponent implements OnInit {
  dataQuestions: any = [];
  techologies: TechnologyStackType[] = TECHNOLOGY_STACK;
  currentTech: WritableSignal<TechnologyStackType> = signal('Angular');

  constructor(private questionAnswerService: QuestionAnswerService) {
    effect(() => {
      this.questionAnswerService
        .getQuestion$(this.currentTech())
        .subscribe((data) => {
          this.dataQuestions = data.data;
        });
    });
  }

  ngOnInit() {}

  onClickTechTagHandler(tech: TechnologyStackType) {
    this.currentTech.set(tech);
  }
}
