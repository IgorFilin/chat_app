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
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { QuestionAnswerService } from '../../services/question-answer.service';
import { RadioButtonCustomComponent } from '../../shared/components/radio-button-custom/radio-button-custom.component';
import { MatInputModule } from '@angular/material/input';
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
  ],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionsComponent implements OnInit {
  questionForm!: FormGroup;

  constructor(
    private questionAnswerService: QuestionAnswerService,
    private ref: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.questionForm = this.formBuilder.group({
      theme: this.formBuilder.control('', [Validators.required]),
      question: this.formBuilder.control('', [Validators.required]),
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

  onSubmit() {
    console.log(this.questionForm.getRawValue());
    // for (const formValueKey in this.createQuestionForm.value) {
    //   this.createQuestionForm.value[formValueKey] =
    //     this.createQuestionForm.value[formValueKey].trim();
    // }
    // console.log(this.createQuestionForm.value);
    // this.questionAnswerService
    //   .addQuestion$(this.createQuestionForm.value)
    //   .subscribe(() => {
    //     this.variantAnswers = ['answer_1'];
    //     this.variantRadioButtons = [{ id: 'radio_1', value: 'answer_1' }];
    //     this.initializeForm();
    //     this.createQuestionForm.updateValueAndValidity();
    //     this.ref.markForCheck();
    //   });
  }
}
