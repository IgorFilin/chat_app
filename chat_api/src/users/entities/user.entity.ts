import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserKeyResetPass } from './userKeyResetPass.entity';
import { Question } from 'src/q&a/entities/question.entity';
@Entity('Users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ip: string;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  isAcceptKey: boolean;

  @Column()
  acceptKey: string;

  @Column()
  authToken: string;

  @Column()
  userPhoto: string;

  @CreateDateColumn()
  date: Date;

  @OneToOne(() => UserKeyResetPass)
  @JoinColumn()
  resetPasswordKey: UserKeyResetPass;

  @OneToMany(() => Question, (question) => question.user)
  question: Question[];
}
