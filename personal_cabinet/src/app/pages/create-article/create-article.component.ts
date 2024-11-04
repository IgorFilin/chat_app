import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MarkdownTextareaComponent } from '../../components/markdown-textarea/markdown-textarea.component';
import { CustomSelectComponent } from '../../shared/components/custom-select/custom-select.component';
import { TECHNOLOGY_STACK } from '../../models/constants';

@Component({
  standalone: true,
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CdkTextareaAutosize,
    MarkdownTextareaComponent,
    CustomSelectComponent
  ],
  styleUrls: ['./create-article.component.scss']
})
export class CreateArticleComponent implements OnInit {
  techologies: string[] = TECHNOLOGY_STACK;
  articleForm: FormGroup = new FormGroup({
    theme: new FormControl('', [Validators.required]),
    article: new FormControl('', [Validators.required]),
  });

  
  constructor() { }

  ngOnInit() {
  }

}
