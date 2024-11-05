import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TagsArticle } from './tags-article.entity';

@Entity('atricle')
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  theme: string;

  @CreateDateColumn()
  date: Date;

  @ManyToOne(() => User, (user) => user.article)
  user: User;

  @ManyToMany(()=> TagsArticle, (tags) => tags.article)
  tags: TagsArticle[]
}
