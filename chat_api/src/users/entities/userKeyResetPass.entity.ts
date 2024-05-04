import { BeforeInsert, Column, Entity } from 'typeorm';

@Entity('UserKeyResetPass')
export class UserKeyReset {
  @Column()
  id: string;

  @Column()
  key: string;

  @Column()
  dateRemoved: Date;

  @BeforeInsert()
  setExpirationDate() {
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1);
    this.dateRemoved = expirationDate;
  }
}
