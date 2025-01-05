import { BadRequestException, Injectable, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { User } from './entities/user.entity';
import { UserKeyResetPass } from './entities/userKeyResetPass.entity';
import { Not, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { EmailService } from 'src/email/email.service';
import * as fs from 'node:fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

interface RestorePassType {
  key: string;
  password: string;
}

interface IUserVkAuthData {
  user_id: string;
  first_name: string;
  last_name: string;
  avatar: string;
  email: string;
  sex: number;
  verified: boolean;
  birthday: string;
  ip: string;
}

@Injectable()
export class UsersService {
  lenthBcryptPassword: number = 60;

  constructor(
    @InjectRepository(User)
    private UserTable: Repository<User>,
    @InjectRepository(UserKeyResetPass)
    private UserKeyResetPassTable: Repository<UserKeyResetPass>,
    private JwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService
  ) {}

  blockedKeysSendingMails = {};

  async create(createUserDto?: CreateUserDto, userIP?: string, isAuthVk?: boolean) {
    try {
      if (!createUserDto || !createUserDto.email || !createUserDto.name || !createUserDto.password) {
        return { message: 'Недостаточно данных для регистрации' };
      }
      const findUser = await this.UserTable.findOneBy({
        email: createUserDto.email,
      });
      if (findUser) {
        return { message: 'К сожалению такая почта уже существует' };
      } else {
        const savedUserData = await this.saveNewUserDb(createUserDto, userIP);
        if (savedUserData) {
          await this.emailService.sendMailTemplate(savedUserData.email, savedUserData.acceptKey);
          return {
            isAcceptKey: savedUserData.isAcceptKey,
            email: savedUserData.email,
            message: !savedUserData.isAcceptKey ? `Приветствую ${savedUserData.name}, пожалуйста введи код подтверждения` : '',
          };
        } else {
          return { message: 'Что-то пошло не так, попробуйте ещё раз' };
        }
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
            setTimeout(async () => {
              user.resetPasswordKey = null;
              await this.UserTable.save(user);
              await this.UserKeyResetPassTable.delete(savedEntity.id);
            }, 3600000);
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
      return result;
    } catch (e) {
      console.log(e);
    }
  }

  async confirmKeyRestorePass(restoreData: RestorePassType) {
    try {
      if (restoreData.password.length < 7) {
        return {
          message: 'Пожалуйста введите пароль, не менее 7 символов',
          isAccept: false,
        };
      }
      const resetPassKeyEntity = await this.UserKeyResetPassTable.findOneBy({ key: restoreData.key });
      if (resetPassKeyEntity) {
        const user = await this.UserTable.findOneBy({ resetPasswordKey: { id: resetPassKeyEntity.id } });
        if (user) {
          const salt = await bcrypt.genSalt();
          const hashedPassword = await bcrypt.hash(restoreData.password, salt);
          user.password = hashedPassword;
          // Удаляем секретный ключ, если пользователь поменял пароль
          user.resetPasswordKey = null;
          await this.UserTable.save(user);
          await this.UserKeyResetPassTable.delete(resetPassKeyEntity.id);
          return {
            message: 'Пароль успешно изменён',
            isAccept: true,
          };
        }
      } else
        return {
          message: 'Не верный секретный ключ, проверье правильность ввода',
          isAccept: false,
        };
    } catch (e) {
      return {
        message: 'Произошла какая то ошибка, обратитесь к администратору',
        isAccept: false,
      };
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
    try {
      if (!LoginUserDto.email || !LoginUserDto.password) {
        return {
          message: 'К сожалению недостаточно данных для авторизации',
        };
      }
      const user = await this.UserTable.findOneBy({ email: LoginUserDto.email });
      if (user && !user.isAcceptKey) {
        return {
          message: 'Пожалуйста подтвердите вашу почту',
        };
      }
      if (user && Object.keys(user).length) {
        let isUserPasswordValid: boolean = false;
        console.log('LoginUserDto', LoginUserDto);
        if (LoginUserDto.password.length === this.lenthBcryptPassword) isUserPasswordValid = LoginUserDto.password === user.password;
        else isUserPasswordValid = await bcrypt.compare(LoginUserDto.password, user.password);

        if (isUserPasswordValid) {
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
    } catch (e) {
      console.warn(e);
    }
  }

  async confirmToken(requestToken: string) {
    try {
      if (!requestToken) {
        return { isAuth: false };
      }
      const user = await this.UserTable.findOneByOrFail({
        authToken: requestToken,
      });
      return {
        name: user.name,
        token: user.authToken,
        isAuth: true,
        id: user.id,
        role: user.role,
      };
    } catch (error) {
      return { isAuth: false };
    }
  }

  async getPhoto(authToken: string) {
    if (authToken) {
      const user = await this.UserTable.findOneBy({ authToken });
      if (user?.authToken) {
        const oldAvatarPathArray = user.userPhoto.split('/');
        const oldAvatarName = oldAvatarPathArray[oldAvatarPathArray.length - 1];
        const dirname = process.cwd();
        const searchPath = path.join('static', 'image', oldAvatarName);
        if (!fs.existsSync(searchPath)) {
          oldAvatarPathArray.reverse()[0] = 'default_photo_user.webp';
          user.userPhoto = oldAvatarPathArray.reverse().join('/');
          this.UserTable.save(user);
        }
        // Если id пользователя равен id найденного пользователя, проверка на всякий случай
        if (user.authToken === authToken) {
          return user.userPhoto;
        }
      }
    }
  }

  async setPhoto(userId: string, newAvatar: any) {
    try {
      if (newAvatar.avatar.size > 400 * 1024) {
        return {
          message: 'Слишком большой размер (до 300кб)',
        };
      }
      if (!['image/png', 'image/webp'].includes(newAvatar.avatar.busBoyMimeType)) {
        return {
          message: 'Неверный формат изображения (webp, png)',
        };
      }
      // Ищем пользователя
      const user = await this.UserTable.findOneBy({
        id: userId,
      });

      const serverHost = this.configService.get('SERVER_HOST');
      const dirname = process.cwd();

      //Проверяем осталась ли неиспользумая аватарка, если да, то удаляем её
      if (user.userPhoto) {
        const oldAvatarPathArray = user.userPhoto.split('/');
        const oldAvatarName = oldAvatarPathArray[oldAvatarPathArray.length - 1];
        const searchPath = path.join('static', 'image', oldAvatarName);
        if (fs.existsSync(searchPath) && oldAvatarName !== 'default_photo_user.webp') {
          fs.unlink(searchPath, () => {});
        }
      }

      // Сохраняем файл по дефолтному пути, в папку dist сборки проекта.
      const savePath = path.join('static', 'image', newAvatar.avatar.originalName);
      const saveServerPath = `${serverHost}/static/image/${newAvatar.avatar.originalName}`;

      fs.copyFile(newAvatar.avatar.path, savePath, () => {});

      // Заменяем у пользователя путь к аварке в БД на новый
      // Если id пользователя равен id найденного пользоваетля, проверка на всякий случай
      if (user.id === userId) {
        user.userPhoto = saveServerPath;
        await this.UserTable.save(user);

        return saveServerPath;
      }
    } catch (e) {}
  }

  async findAll(authToken: string) {
    try {
      return await this.UserTable.find({
        select: ['id', 'name', 'ip', 'userPhoto'],
        where: { authToken: Not(authToken) },
      });
    } catch (e) {}
  }

  async auth_vk(payload: IUserVkAuthData) {
    try {
      if (!payload.email || !payload.first_name || !payload.last_name) return { message: 'К сожалению произошла ошибка, попробуйте ещё раз' };
      const randomGeneratePassword = randomBytes(10).toString('hex');
      const authData: CreateUserDto = {
        email: payload.email,
        password: randomGeneratePassword,
        name: `${payload.first_name} ${payload.last_name}`,
      };
      const findedUser = await this.UserTable.findOneBy({
        email: payload.email,
      });

      if (findedUser) {
        return await this.login({ email: findedUser.email, password: findedUser.password });
      } else {
        return this.saveNewUserDb(authData, payload.ip, true);
      }
    } catch (e) {
      console.log('error', e);
    }
  }

  private async saveNewUserDb(createUserDto: CreateUserDto, userIP?: string, isAcceptKey: boolean = false) {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
      const confirmRegKey = randomBytes(5).toString('hex');

      const imagePath = path.join('static', 'image', 'default_photo_user.webp');

      const token = this.JwtService.sign({
        name: createUserDto.name,
        randomData: uuidv4(),
      });

      const ip = userIP?.slice(7) || 'Скрыт';

      // Создаем пользователя по сущности
      const user = new User();
      user.name = createUserDto.name;
      user.email = createUserDto.email;
      user.password = hashedPassword;
      user.date = new Date();
      user.isAcceptKey = isAcceptKey;
      user.acceptKey = confirmRegKey;
      user.authToken = token;
      user.userPhoto = imagePath;
      user.role = 'user';
      user.ip = ip;

      return await this.UserTable.save(user);
    } catch (e) {
      return;
    }
  }
}
