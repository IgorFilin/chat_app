import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Tags } from './tags.entity';

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

  @ManyToMany(()=> Tags, (tags) => tags.article)
  @JoinTable()
  tags: Tags[]
}
