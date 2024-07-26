import { Telegraf } from 'telegraf';
require('dotenv').config();
import express from 'express';
import { initialize } from './functions/coreFunctions';

const app = express();

const botToken: string = process.env.BOT_TOKEN!;

const bot = new Telegraf(botToken);
console.log(1);
// Настройка вебхука
const PORT = 4000;
const URL = process.env.URL || 'https://filin-hub.online';
// Настройка webhook
bot.telegram.setWebhook(`${URL}/bot/`);

app.use(bot.webhookCallback('/bot/'));

initialize(bot);

bot.action('callback_query', async (ctx: any) => {
  const regx = /id=([^\s;]+);isAccept=(true|false)/;
  const data = ctx.data;
  const id = data.match(regx)[1];
  const isAccept = data.match(regx)[2];
  await ctx.reply(`Правильный ли ответ ${isAccept}, его id = ${id}`);
});

bot.launch();

app.listen(PORT, () => {
  console.log(`Ищи меня в телеграмме, и обучайся программированию 0_0`);
});

app.get('/', (req, res) => {
  res.send('Ищи меня в телеграмме, и обучайся программированию 0_0');
});
