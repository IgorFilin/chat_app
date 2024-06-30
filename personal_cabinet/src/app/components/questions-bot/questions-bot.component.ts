import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { QuestionAnswerService } from '../../services/question-answer.service';
import { RadioButtonCustomComponent } from '../../shared/components/radio-button-custom/radio-button-custom.component';

export type CreateQuestionFormType = {
  question: string;
} & Record<string, string>;
@Component({
  selector: 'cabinet-questions-bot',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RadioButtonCustomComponent],
  templateUrl: './questions-bot.component.html',
  styleUrl: './questions-bot.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionsBotComponent implements OnInit {
  createQuestionForm!: FormGroup;

  variantAnswers: Array<string> = ['answer_1'];
  variantRadioButtons: Array<any> = [{ id: 'radio_1', value: 'answer_1' }];

  constructor(
    private questionAnswerService: QuestionAnswerService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.createQuestionForm = new FormGroup({
      question: new FormControl('', [Validators.required]),
      answer_1: new FormControl('', [Validators.required]),
      acceptAnswer: new FormControl('', [Validators.required]),
    });
  }
  onHandlerClickAddQuestions() {
    const newAnswer = `answer_${this.variantAnswers.length + 1}`;
    const newRadioButton = `radio_${this.variantAnswers.length}`;
    this.variantRadioButtons.push({
      id: newRadioButton,
      value: `answer_${this.variantAnswers.length + 1}`,
    });
    this.variantAnswers.push(newAnswer);
    this.createQuestionForm.addControl(
      newAnswer,
      new FormControl('', [Validators.required])
    );
    this.createQuestionForm.updateValueAndValidity();
    console.log(this.createQuestionForm.getRawValue());
  }

  onHandlerClickRemoveQuestions() {
    const removeControl = this.variantAnswers.pop();
    const removeRadio = this.variantRadioButtons.pop();
    if (removeControl) {
      this.createQuestionForm.removeControl(removeControl);
    }

    if (removeRadio) {
      this.createQuestionForm.patchValue({
        acceptAnswer: `answer_${this.variantAnswers.length}`,
      });
    }

    this.createQuestionForm.updateValueAndValidity();
  }

  onSubmit() {
    for (const formValueKey in this.createQuestionForm.value) {
      this.createQuestionForm.value[formValueKey] =
        this.createQuestionForm.value[formValueKey].trim();
    }
    console.log(this.createQuestionForm.value);
    this.questionAnswerService
      .addQuestion$(this.createQuestionForm.value)
      .subscribe(() => {
        this.variantAnswers = ['answer_1'];
        this.variantRadioButtons = [{ id: 'radio_1', value: 'answer_1' }];
        this.initializeForm();
        this.createQuestionForm.updateValueAndValidity();
        this.ref.markForCheck();
      });
  }
}
