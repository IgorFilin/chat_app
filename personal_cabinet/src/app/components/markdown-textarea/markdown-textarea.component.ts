import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { AbstractControlComponent } from '../../shared/components/abstract-control-input/abstract-control-input.component';

@Component({
  standalone: true,
  selector: 'app-markdown-textarea',
  templateUrl: './markdown-textarea.component.html',
  styleUrls: ['./markdown-textarea.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CdkTextareaAutosize,
    MarkdownModule,
    FormsModule,
  ],
})
export class MarkdownTextareaComponent extends AbstractControlComponent  {
  
  copyedText: {start:number, end: number, text: string, isPreWatch?: boolean} | null = null;
  codeFormsToggle: boolean = false;
  fieldName: string = this.control?.name as string;

  getSelectedText(event: MouseEvent) {
    const textarea = event.target as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const id = textarea.id;
    if (start - end) {
      this.copyedText = {
        start,
        end,
        text: textarea.value.substring(start, end),
      };
    }
  }
  
  onPreWatchHandler(id: string) {
    if(!this.copyedText) return
    this.copyedText.isPreWatch = !this.copyedText.isPreWatch;
  }

  onChangeModeHandler() {
    this.codeFormsToggle = !this.codeFormsToggle;
  }
}
