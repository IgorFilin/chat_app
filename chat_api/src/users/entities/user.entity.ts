import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
}
