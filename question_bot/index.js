const { Telegraf } = require('telegraf');
require('dotenv').config();
const express = require('express');
const app = express();
import { initialize } from './functions/coreFunctions';

const bot = new Telegraf(process.env.BOT_TOKEN);

// Настройка вебхука
const PORT = 4000;
const URL = process.env.URL || 'https://filin-hub.online';

// Настройка webhook
bot.telegram.setWebhook(`${URL}/bot/`);
app.use(bot.webhookCallback('/bot/'));

bot.action('callback_query', async (ctx) => {
  const regx = /id=([^\s;]+);isAccept=(true|false)/;
  const data = ctx.data;
  const id = data.match(regx)[1];
  const isAccept = data.match(regx)[2];
  await ctx.reply(`Правильный ли ответ ${isAccept}, его id = ${id}`);
});

bot.launch().then(() => {
  initialize(bot);
});
