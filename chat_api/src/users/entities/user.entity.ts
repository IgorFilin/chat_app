import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserKeyResetPass } from './userKeyResetPass.entity';
import { Question } from '../../learning-center/entities/question.entity';
import { Article } from '../../learning-center/entities/article.entity';
import { IUserRoles } from '../model/models.interface';
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

  @Column()
  role: IUserRoles;

  @CreateDateColumn()
  date: Date;

  @OneToOne(() => UserKeyResetPass)
  @JoinColumn()
  resetPasswordKey: UserKeyResetPass;

  @OneToMany(() => Question, (question) => question.user)
  question: Question[];

  @OneToMany(() => Article, (article) => article.user)
  article: Article[];
  
}
