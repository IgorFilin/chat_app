import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Article } from './article.entity';

@Entity('views')
export class Views {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => Article, (article) => article.views, {
    onDelete: 'CASCADE',
  })
  article: Article;
}
