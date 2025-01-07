import { Component, computed, effect, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { IArticleResponse } from '../../models/interfaces';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { UserStore } from '../../store/user/user.store';
import { bubbleAnimation } from '../../animations/bubble.animation';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MarkdownTextareaComponent } from '../../components/markdown-textarea/markdown-textarea.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { KnowledgeService } from '../../services/knowledge.service';

@Component({
  standalone: true,
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  imports: [ 
    CommonModule,
    MarkdownModule,
    IconComponent,
    ReactiveFormsModule,
    MarkdownTextareaComponent, 
    InputComponent,
  ],
  animations: [ bubbleAnimation ],
})
export class ArticleComponent implements OnInit {
  isYourArticle: Signal<boolean> = computed(() => this.userStore.userId() === this.article()?.user.id);
  articleId: WritableSignal<string> = signal<string>('')
  article:WritableSignal<IArticleResponse | null> = signal(null);
  isEditMode: WritableSignal<boolean> = signal(false);
  userStore = inject(UserStore)
  editedArticleForm = this.formBuilder.group({
    title: ['', [Validators.required]],
    text: ['', [Validators.required]],
  })

  constructor(
    private knowledgeService: KnowledgeService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { 
    effect(() => {
      this.knowledgeService.getArticle(this.articleId()).subscribe((data) => {
        this.article.set(data)
        this.setInitialDataArticle()
      })
    })
  }

  setInitialDataArticle() {
    this.editedArticleForm.patchValue({
      title: this.article()?.title,
      text: this.article()?.description,
    })
  }

  ngOnInit() {
    const articleId = this.activatedRoute.snapshot.paramMap.get('id')
    if (articleId) this.articleId.set(articleId);
  }

  onSaveArticleHandler() { 
    const formData = this.editedArticleForm.getRawValue()
    console.log('data ', formData);
  }
}
