export class CreateArticleDto {
  title: string;
  stack: string;
  text: string;
  tags: string[];
}

export class DeleteArticleDto {
  id: string;
}
