import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { QuestionAnswerService } from '../../services/question-answer.service';
import {RadioButtonCustomComponent} from "../../shared/components/radio-button-custom/radio-button-custom.component";

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
export class QuestionsBotComponent {
  createQuestionForm: FormGroup = new FormGroup(
    {
      question: new FormControl('', [Validators.required]),
      answer_0: new FormControl('', [Validators.required]),
      radio_0: new FormControl(false,[Validators.requiredTrue])
    },
    Validators.required
  );

  variantAnswers: Array<string> = ['answer_0'];
  variantRadioButtons: Array<string> = ['radio_0']

  constructor(private questionAnswerServise: QuestionAnswerService) {}

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
    console.log(this.createQuestionForm.value)
    // this.questionAnswerServise.addQuestion$(this.createQuestionForm.value);
  }
}
