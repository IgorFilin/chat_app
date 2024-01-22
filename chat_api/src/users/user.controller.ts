import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  Res,
  Req,
  Ip,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ValidationPipe } from '@nestjs/common';
import { Response, Request } from 'express';
import { FormDataRequest, MemoryStoredFile } from 'nestjs-form-data';
import { FormDataTestDto } from './dto/request-file';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('registration')
  @UsePipes(new ValidationPipe())
  async create(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
    @Ip() ip: string,
  ) {
    const result = await this.usersService.create(createUserDto, ip);
    if (result.isAcceptKey === false) {
      return res.send(result);
    } else {
      return res.status(403).send(result);
    }
  }

  @Post('login')
  async login(@Body() LoginUserDto: LoginUserDto, @Res() res: Response) {
    const result = await this.usersService.login(LoginUserDto);

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 3);

    res.cookie('authToken', result.token, {
      httpOnly: true,
      expires: expirationDate,
    });
    return res.send(result);
  }

  @Get('auth')
  async auth(@Req() req: Request, @Res() res: Response) {
    const result = await this.usersService.confirmToken(req.cookies.authToken);
    const resultObject: any = { isAuth: result?.isAuth };
    if (result?.isAuth) {
      resultObject.name = result.name;
      resultObject.id = result.id;
      resultObject.isAcceptKey = true;
      res.status(201).send(resultObject);
    } else {
      res.status(404).send(resultObject);
    }
  }

  @Get('avatar')
  async getAvatar(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies.authToken;
    const result = await this.usersService.getPhoto(token);
    if (result) {
      res.sendFile(result);
    } else {
      res.sendStatus(403);
    }
  }

  @Post('avatar')
  @FormDataRequest({ storage: MemoryStoredFile })
  async setAvatar(
    @Body() newAvatar: FormDataTestDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = req.query.id as string;
    const result: any = await this.usersService.setPhoto(userId, newAvatar);
    if (result.message) {
      res.status(415).type('application/json').send({
        message: result.message,
      });
    } else {
      res.sendFile(result);
    }
  }

  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('authToken');
    res.send({ isAuth: false });
  }

  @Get('confirm')
  async confirm(@Req() req: Request, @Res() res: Response) {
    const key: any = req.query.key;
    const mail: any = !!req.query.mail;
    const result = await this.usersService.confirmRegistration(key);
    if (result.isAcceptKey) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 3);
      res.cookie('authToken', result.token, {
        httpOnly: true,
        expires: expirationDate,
      });
      if (mail) {
        return res.redirect('http://filin-hub.online/');
      }
      res.send({ isAcceptKey: result.isAcceptKey, message: result.message });
    } else {
      res.status(403).send({ message: result.message });
    }
  }

  @Get('send_mail_confirm')
  async sendMailConfirm(@Req() req: Request, @Res() res: Response) {
    const email: any = req.query.email;
    const result = await this.usersService.sendMainConfirm(email);
    let statusCode: number;
    if (result) {
      if (!result.isBlocked) statusCode = 201;
      else statusCode = 429;
      res.status(statusCode).send(result);
    }
  }

  @Get('users_list')
  async users_list(@Req() req: Request, @Res() res: Response) {
    const result = await this.usersService.confirmToken(req.cookies.authToken);
    if (result.isAuth) {
      const users = await this.usersService.findAll();
      res.status(201).send(users);
    } else {
      res.status(404);
    }
  }
}
