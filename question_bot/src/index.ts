import { Bot, Context, Keyboard, session, SessionFlavor, InlineKeyboard } from 'grammy';
require('dotenv').config();
import { getQuestion, login } from './functions/coreFunctions';

interface SessionData {
  token: string | null;
  questionIndex: null | string;
  questionList: [];
  questionIndexUsedList: [];
}
type MyContext = Context & SessionFlavor<SessionData>;

const botToken: string = process.env.BOT_TOKEN!;

const bot = new Bot<MyContext>(botToken);

function initial(): SessionData {
  return {
    token: null,
    questionIndex: null,
    questionList: [],
    questionIndexUsedList: [],
  };
}
bot.use(session({ initial }));
const URL = process.env.URL || 'https://training-program.ru';

async function authStartBot(ctx: any) {
  const token = ctx.session?.token;

  if (!token) {
    const questionTextHTML = `
    🔑 Введите логин и пароль через пробел для входа в аккаунт

    ✏️ В формате: ваша_почта@почта.ru пароль

    🔒 Если у вас нет аккаута, вы можете зарегистрироваться по ссылке: 

    📨 <a href="https://training-program.ru/registration">ССЫЛКА</a>

    🔧 Так же вы можете ознакомится как пользоваться ботом по команде:

    /help — для получения справки по команде и использованию бота.
    `;
    await ctx.reply(questionTextHTML, {
      parse_mode: 'HTML', // Указываем, что сообщение в формате HTML
    });
    return;
  }

  const userId = ctx.from?.id;

  await ctx.reply('Добро пожаловать, я бот который будет задавать тебе вопросы по программированию, веселого обучения!', {
    reply_markup: Keyboard.from([[Keyboard.text('Задать вопрос')]]).resized(),
  });
}

bot.command('start', (ctx: any) => {
  authStartBot(ctx);
});

bot.command('help', async (ctx: any) => {
  const questionTextHTML = `
  🔒 Регистрация доступна по <a href="https://training-program.ru/registration">Ссылке</a> 

  🔔 Вы так же можете добавлять свои вопросы с вариантами ответов для коллекции по <a href="https://cabinet.training-program.ru/login">Ссылке</a>

  🔼 Данные для входа такие же как и для бота, которые доступны после регистрации по ссылке выше. 🔼
  `;
  await ctx.reply(questionTextHTML, {
    parse_mode: 'HTML',
  });
});

bot.on('callback_query', async (ctx: any) => {
  const token = ctx.session?.token;
  if (!token) {
    return;
  }

  // Отправляем подтверждение запроса
  await ctx.answerCallbackQuery();

  // Извлекаем данные из запроса
  const regx = /id=([^\s;]+);isAccept=(true|false)/;
  const data = ctx.callbackQuery.data;
  const id = data.match(regx)[1];
  const isAccept = JSON.parse(data.match(regx)[2]);

  // отправляем ответ пользователю
  if (isAccept) {
    await ctx.reply('🎉 Правильный ответ! 🎉', {
      reply_markup: Keyboard.from([[Keyboard.text('Задать вопрос')]]).resized(),
    });
  } else {
    await ctx.reply('❌ Увы, это неверный ответ. ❌', {
      reply_markup: Keyboard.from([[Keyboard.text('Задать вопрос')], [Keyboard.text('Попробовать снова')]]).resized(),
    });
  }
  ctx.reply(`Правильный ли ответ ${isAccept}, его id = ${id}`);
});

bot.on('message', async (ctx: any) => {
  const textMessage = ctx.update.message.text;
  switch (true) {
    case /Задать вопрос/.test(textMessage):
      getQuestion(bot, ctx);
      break;
    case /Попробовать снова/.test(textMessage):
      getQuestion(bot, ctx, false);
      break;
    case /.+@.+\..+/.test(textMessage):
      const token = ctx.session?.token;
      if (!token) {
        try {
          const response = await login(textMessage);
          console.log('response', response);
          if (response?.data) {
            ctx.session.token = response?.data.token;
            ctx.reply('✅ ' + response?.data.message);
            await authStartBot(ctx);
          }
        } catch (e) {
          ctx.reply('⚠️ К сожалению неверные данные, попробуйте ещё раз ⚠️');
        }
      } else {
        ctx.reply('🎉 Вы уже авторизованы, удачного обучения');
      }
      break;
    default:
      break;
  }
});

bot.start();
