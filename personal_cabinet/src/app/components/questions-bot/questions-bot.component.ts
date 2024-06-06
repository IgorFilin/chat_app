import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
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
  createQuestionForm: FormGroup = new FormGroup({
    question: new FormControl('', [Validators.required]),
    answer_0: new FormControl('', [Validators.required]),
  });

  variantAnswers: Array<string> = ['answer_0'];

  onHandlerClickAddQuestions() {
    const newAnswer = `answer_${this.variantAnswers.length - 1}`;
    this.variantAnswers.push(newAnswer);
    this.createQuestionForm.addControl(
      newAnswer,
      new FormControl('', [Validators.required])
    );
  }

  onSubmit() {
    console.log(this.createQuestionForm.value);
  }
}
