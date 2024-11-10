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
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { QuestionAnswerService } from '../../services/question-answer.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ToasterService } from '../../services/toaster.service';
import { bubbleAnimation } from '../../animations/bubble.animation';

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
    InputComponent,
    SearchInputComponent,
    IconComponent
  ],
  styleUrls: ['./create-article.component.scss'],
  animations: [ bubbleAnimation ],
})
export class CreateArticleComponent implements CanDeactivate<void> {
  techologies: string[] = TECHNOLOGY_STACK;
  articleForm: FormGroup = new FormGroup({
    stack: new FormControl('', [Validators.required]),
    title: new FormControl('', [Validators.required]),
    text: new FormControl('', [Validators.required]),
    tags: new FormControl([]) 
  });

  
  constructor(
    private changeDetection: ChangeDetectorRef,
    private questionAnswerService: QuestionAnswerService,
    private toasterService: ToasterService,
  ) { }

  canDeactivate(): CanDeactivateType  {
    if (this.articleForm.dirty) {
      const result = confirm('Ваши данные могут не сохранится, вы уверены?');
      return result;
    } else return true
  }

  onRemoveTag(index: number) {
    const tags = this.articleForm.get('tags')
    if (tags) {
      tags.patchValue([...tags.value.filter((tag:any, tagIndex:number) => tagIndex !== index)])
    }
  }

  searchTag = (searchValue:string) => {
    return this.questionAnswerService.getTag(searchValue);
  }

  onSetTag(tag:string) {
   const tags = this.articleForm.get('tags')

   if(tags?.value.length === 5) {
    this.toasterService.info('Набрано максимальное количество тегов');
    return
  }
   
   if(tags?.value.includes(tag)) {
     this.toasterService.info('Такой тег уже есть в списке');
     return
   }

   if (tags) {
     tags.patchValue([...tags.value, tag])
   }
  }

  onSubmit() {
    this.questionAnswerService.createArticle(this.articleForm.getRawValue()).subscribe();
  }
}
