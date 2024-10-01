import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { QuestionAnswerService } from '../../services/question-answer.service';
import { RadioButtonCustomComponent } from '../../shared/components/radio-button-custom/radio-button-custom.component';
import { MatInputModule } from '@angular/material/input';
import { TECHNOLOGY_STACK } from '../../models/constants';
import { MarkdownModule } from 'ngx-markdown';
export type CreateQuestionFormType = {
  question: string;
} & Record<string, string>;

@Component({
  selector: 'cabinet-questions',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RadioButtonCustomComponent,
    MatCheckboxModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    CdkTextareaAutosize,
    MarkdownModule,
    FormsModule,
  ],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionsComponent implements OnInit {
  questionForm!: FormGroup;
  techologies: string[] = TECHNOLOGY_STACK;
  markdown: string =
    "```typescript \n console.log(1) \n typeof null = 'object' \n const a = 10";
  copyedText: Record<string, any> = {};
  markdownCodeFormsToggle: any = {};
  constructor(
    private questionAnswerService: QuestionAnswerService,
    private ref: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.initializeForm();

    this.questionForm.valueChanges.subscribe((form) => {
      const markdownRegex = /```\s*typescript/;
      // this.isMarkdownCode = markdownRegex.test(form.question);
    });
  }

  initializeForm() {
    this.questionForm = this.formBuilder.group({
      theme: this.formBuilder.control('', [Validators.required]),
      question: this.formBuilder.control('', [Validators.required]),
      description: this.formBuilder.control(''),
      answers: this.formBuilder.array([
        this.formBuilder.group({
          value: this.formBuilder.control('', [Validators.required]),
          accept: this.formBuilder.control(false, [Validators.required]),
        }),
      ]),
    });
  }

  get answersArray() {
    return this.questionForm.get('answers') as FormArray;
  }

  onHandlerClickAddQuestions() {
    this.answersArray.push(
      this.formBuilder.group({
        value: this.formBuilder.control('', [Validators.required]),
        accept: this.formBuilder.control(false, [Validators.required]),
      })
    );
  }

  onHandlerClickRemoveQuestions() {
    this.answersArray.removeAt(this.answersArray.length - 1);
  }

  onChangeModeHandler(idForm: string) {
    this.markdownCodeFormsToggle[idForm] =
      !this.markdownCodeFormsToggle[idForm];
  }

  getSelectedText(event: MouseEvent) {
    const textarea = event.target as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const id = textarea.id;
    if (start - end) {
      this.copyedText[id] = {
        start,
        end,
        text: textarea.value.substring(start, end),
      };
    }
  }

  onTransformTestInCode(id: string) {
    const transformedText = `\`\`\`typescript \n ${this.copyedText[id].text} \n \`\`\` \n`;
    const beforeString = this.questionForm
      .get('question')
      ?.value.substring(0, this.copyedText[id]['start']);
    const afterString = this.questionForm
      .get('question')
      ?.value.substring(
        this.copyedText[id]['end'],
        this.questionForm.get('question')?.value.length
      );
    const result = `${beforeString} ${transformedText} ${afterString}`;
    this.questionForm.patchValue({ [id]: result });
    // console.log(1) - это консоль лог
  }

  onPreWatchHandler(id: string) {
    if (!this.copyedText[id]) this.copyedText[id] = {};
    this.copyedText[id].isPreWatch = !this.copyedText[id].isPreWatch;
  }

  onSubmit() {
    this.questionAnswerService
      .addQuestion$(this.questionForm.getRawValue())
      .subscribe(() => {
        this.questionForm.reset();
        this.initializeForm();
        this.ref.markForCheck();
      });
  }
}
