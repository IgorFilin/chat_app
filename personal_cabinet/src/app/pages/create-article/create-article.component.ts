import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MarkdownTextareaComponent } from '../../components/markdown-textarea/markdown-textarea.component';
import { CustomSelectComponent } from '../../shared/components/custom-select/custom-select.component';
import { TECHNOLOGY_STACK } from '../../models/constants';
import { InputComponent } from '../../shared/components/input/input.component';
import { CanDeactivate } from '@angular/router';
import { CanDeactivateType } from '../../core/guard/can-deactivate-guard';

@Component({
  standalone: true,
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CdkTextareaAutosize,
    MarkdownTextareaComponent,
    CustomSelectComponent,
    InputComponent
  ],
  styleUrls: ['./create-article.component.scss']
})
export class CreateArticleComponent implements CanDeactivate<void> {
  techologies: string[] = TECHNOLOGY_STACK;
  articleForm: FormGroup = new FormGroup({
    stack: new FormControl('', [Validators.required]),
    title: new FormControl('', [Validators.required]),
    text: new FormControl('', [Validators.required]),
  });

  
  constructor(private changeDetection: ChangeDetectorRef) { }

  canDeactivate(): CanDeactivateType  {
    if (this.articleForm.dirty) {
      const result = confirm('Ваши данные могут не сохранится, вы уверены?');
      return result;
    } else return true
  }

  onSubmit() {
  
  }
}
