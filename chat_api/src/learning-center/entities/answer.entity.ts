import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';

@Entity('answer')
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  isCorrect: boolean;

  @CreateDateColumn()
  date: Date;

  @ManyToOne(() => Question, (question) => question.answer)
  question: Question;
}
