import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { AbstractControlComponent } from '../../shared/components/abstract-control-input/abstract-control-input.component';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { bubbleAnimation } from '../../animations/bubble.animation';
import { EventOutsideElementDirective } from '../../directives/event-outside-element.directive';

export enum TransformText {
  CODE = 'code',
  BLOCK_CODE = 'block-code',
  LINE = 'line',
  SLASH = 'text-slash',
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
  animations: [bubbleAnimation],
  hostDirectives: [{
    directive: EventOutsideElementDirective,
    outputs: ['documentMousedown'],
  }]
})
export class MarkdownTextareaComponent extends AbstractControlComponent  {
  
  copyedText: {start: number, end: number, text: string} | null = null;
  codeFormsToggle: boolean = false;
  fieldName: string = this.control?.name as string;
  isPreWatch: boolean = false

  @HostListener('documentMousedown',['$event']) onDocumentMousedown(event:Event) {
    this.getSelectedText(event, true)
  }
  getSelectedText(event: MouseEvent | Event, isOutside:boolean = false) {
    const textarea = event.target as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
      this.copyedText = {
        start,
        end,
        text: textarea.value.substring(start, end),
      };
  }
  
  onPreWatchHandler() {
    this.isPreWatch = !this.isPreWatch;
  }

  onTransformTest(mode: any) {
    let transformedText = ''
    let result = '';
    switch (mode) {
      case TransformText.BLOCK_CODE:{
        const template = `\`\`\`typescript \n ${this.copyedText?.text} \n \`\`\` \n`
        result = this.transformOnGetSelecrtedText(template);
        break;
      }
      case TransformText.CODE:{
        const template = `\`\`\` ${this.copyedText?.text} \`\`\``
        result = this.transformOnGetSelecrtedText(template);
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
      case TransformText.SLASH:{
        const template = `~~${this.copyedText?.text}~~`
        result = this.transformOnGetSelecrtedText(template);
        break;
      }
    }

    this.value = result;
    this.onChange(this.value);
    this.copyedText = null
  }

  transformOnGetSelecrtedText(template:string) {
    const beforeString = this.value.substring(0, this.copyedText!['start']);
    const afterString = this.value.substring(
        this.copyedText!['end'],
        this.value.length
      );
    return `${beforeString} ${template} ${afterString}`;
  }

  onTextareaChange(event: Event) { 
    this.getSelectedText(event)
  }

  onChangeModeHandler() {
    this.codeFormsToggle = !this.codeFormsToggle;
  }
}
