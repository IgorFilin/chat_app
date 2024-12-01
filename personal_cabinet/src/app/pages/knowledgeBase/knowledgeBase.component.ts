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
  dataPaginationArticles: any = [];
  techologies: TechnologyStackType[] = TECHNOLOGY_STACK;
  currentPage: WritableSignal<number> = signal(1);
  dataArticlesInPage: number = 10;
  start:number= 0;
  end:number= 10;
  pagination:number[] = [];
  // currentTech: WritableSignal<TechnologyStackType> = signal('');

  constructor(
    private questionAnswerService: QuestionAnswerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.questionAnswerService
    .getArticles()
    .subscribe((data) => {
      this.dataArticles = data;
      this.dataPaginationArticles = this.dataArticles.slice(this.start, this.end);
      this.initialPagination()
    });
  }

  filteredPagination(isIncrement?:boolean) {
    if(isIncrement) {
      this.start = this.start + this.dataArticlesInPage
      this.end = this.end + this.dataArticlesInPage
    } else {
      this.start = this.start - this.dataArticlesInPage
      this.end = this.end - this.dataArticlesInPage
    }
    this.dataPaginationArticles = this.dataArticles.slice(this.start, this.end);

  }

  initialPagination() {
    for(let i = 0; i < Math.ceil(this.dataArticles.length / this.dataArticlesInPage); i++) {
      this.pagination.push(i + 1);
    }
  }

  setPage(page: number) { 
    if(page > this.currentPage()) {
      this.filteredPagination(true);
    } else {
      this.filteredPagination();
    }
    this.currentPage.set(page);
  }

  onClickTechTagHandler(tech: TechnologyStackType) {
    // this.currentTech.set(tech);
  }
}
