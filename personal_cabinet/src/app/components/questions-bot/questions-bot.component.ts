import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'cabinet-questions-bot',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './questions-bot.component.html',
  styleUrl: './questions-bot.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionsBotComponent {
  createQuestionForm: FormGroup = new FormGroup(
    {
      question: new FormControl('', [Validators.required]),
      answer_0: new FormControl('', [Validators.required]),
    },
    Validators.required
  );

  variantAnswers: Array<string> = ['answer_0'];

  onHandlerClickAddQuestions() {
    const newAnswer = `answer_${this.variantAnswers.length}`;
    this.variantAnswers.push(newAnswer);
    this.createQuestionForm.addControl(
      newAnswer,
      new FormControl('', [Validators.required])
    );
    this.createQuestionForm.updateValueAndValidity();
  }

  onHandlerClickRemoveQuestions() {
    const removeControl = this.variantAnswers.pop();
    if (removeControl) {
      this.createQuestionForm.removeControl(removeControl);
      this.createQuestionForm.updateValueAndValidity();
    }
  }

  onSubmit() {
    for (const formValueKey in this.createQuestionForm.value) {
      this.createQuestionForm.value[formValueKey] =
        this.createQuestionForm.value[formValueKey].trim();
    }
    console.log(this.createQuestionForm.value);
  }
}
