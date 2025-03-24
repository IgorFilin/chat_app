import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Answer } from './answer.entity';
import { User } from '../../users/entities/user.entity';

@Entity('question')
export class Question {
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

  @ManyToOne(() => User, (user) => user.question)
  user: User;

  @OneToMany(() => Answer, (answer) => answer.question)
  answer: Answer[];
}
