import { IsString, MinLength } from 'class-validator';

export class FormDataUserRestorePass {
  @IsString()
  key: string;

  @MinLength(6, { message: 'Пожалуйста введи в пароль больше 6 символов' })
  password: string;
}
