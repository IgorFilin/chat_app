import { Component, effect, OnInit, signal, WritableSignal } from '@angular/core';
import { QuestionAnswerService } from '../../services/question-answer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { IArticleResponse } from '../../models/interfaces';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  standalone: true,
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  imports: [ CommonModule, MarkdownModule, IconComponent ]
})
export class ArticleComponent implements OnInit {

  articleId: WritableSignal<string> = signal<string>('')
  article:IArticleResponse | null = null

  constructor(
    private questionAnswerService: QuestionAnswerService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { 
    effect(() => {
      this.questionAnswerService.getArticle(this.articleId()).subscribe((data) => {
        this.article = data
      })
    })
  }

  ngOnInit() {
    const articleId = this.activatedRoute.snapshot.paramMap.get('id')
    if (articleId) this.articleId.set(articleId);
  }

}
