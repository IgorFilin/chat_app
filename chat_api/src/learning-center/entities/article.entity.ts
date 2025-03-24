import { User } from '../../users/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Tags } from './tags.entity';
import { Views } from './views-article.entity';

@Entity('article')
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @CreateDateColumn()
  date: Date;

  @OneToMany(() => Views, (views) => views.article, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  views: Views[];

  @ManyToOne(() => User, (user) => user.article)
  user: User;

  @ManyToMany(() => Tags, (tags) => tags.article)
  @JoinTable()
  tags: Tags[];
}
