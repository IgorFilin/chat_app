import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { AbstractControlComponent } from '../../shared/components/abstract-control-input/abstract-control-input.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { bubbleAnimation } from '../../animations/bubble.animation';

export enum TransformText {
  CODE = 'code',
  BLOCK_CODE = 'block-code',
  LINE = 'line',
}

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
    IconComponent
  ],
  animations: [bubbleAnimation]
})
export class MarkdownTextareaComponent extends AbstractControlComponent  {
  
  copyedText: {start: number, end: number, text: string} | null = null;
  codeFormsToggle: boolean = false;
  fieldName: string = this.control?.name as string;
  isPreWatch: boolean = false


  getSelectedText(event: MouseEvent | Event) {
    const textarea = event.target as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    // if (start - end) {
      this.copyedText = {
        start,
        end,
        text: textarea.value.substring(start, end),
      };
    // }
  }
  
  onPreWatchHandler() {
    this.isPreWatch = !this.isPreWatch;
  }

  onTransformTest(mode: any) {
    let transformedText = ''
    let result = '';
    switch (mode) {
      case TransformText.BLOCK_CODE:{
        transformedText = `\`\`\`typescript \n ${this.copyedText?.text} \n \`\`\` \n`;
        const beforeString = this.value.substring(0, this.copyedText!['start']);
        const afterString = this.value.substring(
            this.copyedText!['end'],
            this.value.length
          );
        result = `${beforeString} ${transformedText} ${afterString}`;
        break;
      }
      case TransformText.CODE:{
        transformedText = `\`\`\` ${this.copyedText?.text} \`\`\``;
        const beforeString = this.value.substring(0, this.copyedText!['start']);
        const afterString = this.value.substring(
            this.copyedText!['end'],
            this.value.length
          );
        result = `${beforeString} ${transformedText} ${afterString}`;
        break;
      }
      case TransformText.LINE:{
        transformedText = `***`;
        const beforeString = this.value.substring(0, this.copyedText!['start']);
        const afterString = this.value.substring(
            this.copyedText!['start'],
            this.value.length
          );
        result = `${beforeString} ${transformedText} ${afterString}`;
        console.log(result);
        break;
      }
    }

    this.value = result;
    this.onChange(this.value);
    this.copyedText = null
    // console.log(1) - это консоль лог
  }

  onTextareaChange(event: Event) { 
    this.getSelectedText(event)
  }

  onChangeModeHandler() {
    this.codeFormsToggle = !this.codeFormsToggle;
  }
}
