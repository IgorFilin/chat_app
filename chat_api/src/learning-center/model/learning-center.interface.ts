export interface IQuestionDto {
  value: string;
  accept: boolean;
}

export type ThemeType = 'JavaScript' | 'Typescript' | 'Angular' | 'Vue' | 'DataScience';
export enum QuestionThemeEnum {
  JavaScript = 'JavaScript',
  Typescript = 'Typescript',
  Angular = 'Angular',
  Vue = 'Vue',
  DataScience = 'DataScience',
}
