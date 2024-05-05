import { BadRequestException, Injectable, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { User } from './entities/user.entity';
import { UserKeyResetPass } from './entities/userKeyResetPass.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { EmailService } from 'src/email/email.service';
import * as fs from 'node:fs';
import * as path from 'path';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private UserTable: Repository<User>,
    @InjectRepository(UserKeyResetPass)
    private UserKeyResetPassTable: Repository<UserKeyResetPass>,
    private JwtService: JwtService,
    private readonly emailService: EmailService
  ) {}

  blockedKeysSendingMails = {};

  async create(createUserDto: CreateUserDto, userIP: string) {
    try {
      const findUser = await this.UserTable.findOneBy({
        email: createUserDto.email,
      });
      if (findUser) {
        return { message: 'К сожалению такая почта уже существует' };
      } else {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
        const confirmRegKey = randomBytes(5).toString('hex');

        const dirname = process.cwd();
        const imagePath = path.join(dirname, 'dist', 'static', 'image', 'default_photo_user.webp');

        const token = this.JwtService.sign({
          name: createUserDto.name,
          password: createUserDto.password,
        });

        const ip = userIP.slice(7);
        // Создаем пользователя по сущности
        const user = new User();
        user.name = createUserDto.name;
        user.email = createUserDto.email;
        user.password = hashedPassword;
        user.date = new Date();
        user.isAcceptKey = false;
        user.acceptKey = confirmRegKey;
        user.authToken = token;
        user.userPhoto = imagePath;
        user.ip = ip ? ip : 'Скрыт';

        // Сохраняем в БД пользователя с регистрационным key
        await this.UserTable.save(user);
        // Отсылаем на почту ключ подтверждения
        await this.emailService.sendMailTemplate(user.email, confirmRegKey);

        // Возвращаем значение что ключ на почту отправлен, но не подтвержден
        return {
          isAcceptKey: false,
          email: user.email,
          message: `Приветствую ${user.name}, пожалуйста введи код подтверждения`,
        };
      }
    } catch (e) {}
  }

  async sendMainConfirm(email: string, type: 'reg' | 'pass' = 'reg') {
    const user = await this.UserTable.findOne({ where: { email }, relations: ['resetPasswordKey'] });
    try {
      if (!user) {
        return {
          message: 'Такой почты не существует, попробуйте ещё раз',
        };
      }
      if (this.blockedKeysSendingMails.hasOwnProperty(email)) {
        return {
          message: 'Пожалуйста отправьте повторное письмо чуть позже',
          isBlocked: true,
        };
      }
      this.blockedKeysSendingMails[email] = true;
      let acceptKey: string;
      switch (type) {
        case 'reg': {
          // Если тип регистрации присваиваем ключу подтверждения, ключ подтвержедния из БД.
          acceptKey = user.acceptKey;
          break;
        }
        case 'pass': {
          if (!user.resetPasswordKey) {
            // Если тип восстановления пароля, присваиваем ключу сгенерированное значение, и сохраняем его в таблицу [пользователь - временный ключ сброса пароля]
            acceptKey = randomBytes(5).toString('hex');
            // Создаем сущность в таблице временных ключей сброса
            const savedEntity = new UserKeyResetPass();
            savedEntity.key = acceptKey;
            await this.UserKeyResetPassTable.save(savedEntity);
            // Обновляем пользователя тем самым сохраняем связь с таблицей ключей для нужного пользователя
            user.resetPasswordKey = savedEntity;
            await this.UserTable.save(user);
          } else {
            acceptKey = user.resetPasswordKey.key;
          }
          break;
        }
      }
      setTimeout(() => {
        delete this.blockedKeysSendingMails[email];
      }, 7000);
      const result = await this.emailService.sendMailTemplate(user.email, acceptKey, type);
      console.log(result);
      return result;
    } catch (e) {
      console.log(e);
    }
  }

  async confirmKeyRestorePass(key: string) {
    const resetPassKeyEntity = await this.UserKeyResetPassTable.findOneBy({ key });
    if (resetPassKeyEntity) {
      const user = await this.UserTable.findOneBy({ resetPasswordKey: { id: resetPassKeyEntity.id } });
      if (user) {
        return {};
      }
    }
  }

  async confirmRegistration(key: string) {
    try {
      const acceptUser = await this.UserTable.findOneBy({ acceptKey: key });
      if (acceptUser) {
        acceptUser.isAcceptKey = true;
        await this.UserTable.save(acceptUser);
        return {
          isAcceptKey: true,
          token: acceptUser.authToken,
          message: `Добро пожаловать ${acceptUser.name}`,
        };
      } else {
        return { message: 'К сожалению код не верный, попробуйте ещё раз' };
      }
    } catch (e) {}
  }

  async login(LoginUserDto: LoginUserDto) {
    if (LoginUserDto.email === '' || LoginUserDto.password === '') {
      throw new BadRequestException('К сожалению недостаточно данных для авторизации');
    }
    const user = await this.UserTable.findOneBy({ email: LoginUserDto.email });
    if (user && !user.isAcceptKey) {
      throw new BadRequestException('Пожалуйста подтвердите вашу почту');
    }
    if (user && Object.keys(user).length) {
      const userPasswordValid = await bcrypt.compare(LoginUserDto.password, user.password);
      if (userPasswordValid) {
        return {
          message: `Добро пожаловать ${user.name}`,
          name: user.name,
          token: user.authToken,
          isAuth: true,
          id: user.id,
        };
      } else {
        throw new BadRequestException('Неверный пароль');
      }
    } else {
      throw new BadRequestException('К сожалению такого пользователя не существует');
    }
  }

  async confirmToken(requestToken: any) {
    if (!requestToken) {
      return { isAuth: false };
    }
    try {
      const user = await this.UserTable.findOneByOrFail({
        authToken: requestToken,
      });
      return {
        name: user.name,
        token: user.authToken,
        isAuth: true,
        id: user.id,
      };
    } catch (error) {
      return { isAuth: false };
    }
  }

  async getPhoto(authToken: string) {
    if (authToken) {
      const user = await this.UserTable.findOneBy({ authToken });
      if (user?.authToken) {
        const image = path.basename(user.userPhoto);
        const dirname = process.cwd();
        const isPicturePresent = fs.existsSync(path.join(dirname, 'dist', 'static', 'image', image));
        const imagePath = path.join(
          dirname,
          'dist',
          'static',
          'image',
          isPicturePresent ? image : 'default_photo_user.webp'
        );

        // Если id пользователя равен id найденного пользователя, проверка на всякий случай
        if (user.authToken === authToken) {
          user.userPhoto = imagePath;
          await this.UserTable.save(user);
          return imagePath;
        }
      }
    }
  }

  async setPhoto(userId: string, newAvatar: any) {
    try {
      // Сохраняем файл по дефолтному пути, в папку dist сборки проекта.
      const dirname = process.cwd();
      const savePath = path.join(dirname, 'dist', 'static', 'image', newAvatar.avatar.originalName);
      fs.writeFile(savePath, newAvatar.avatar.buffer, () => {});

      // Заменяем у пользователя путь к аварке в БД на новый
      // Ищем пользователя
      const user = await this.UserTable.findOneBy({
        id: userId,
      });

      // Если id пользователя равен id найденного пользоваетля, проверка на всякий случай
      if (user.id === userId) {
        user.userPhoto = savePath;
        await this.UserTable.save(user);

        return savePath;
      }
    } catch (e) {}
  }

  async findAll() {
    try {
      return await this.UserTable.find({ select: ['id', 'name', 'ip'] });
    } catch (e) {}
  }
}
