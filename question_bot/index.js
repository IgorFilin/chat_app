const { Telegraf } = require('telegraf');
require('dotenv').config();
const express = require('express');
const app = express();

const bot = new Telegraf(process.env.BOT_TOKEN);

// Настройка вебхука
const PORT = 4000;
const URL = process.env.URL || 'https://filin-hub.online';

// Настройка webhook
bot.telegram.setWebhook(`${URL}/bot/`);
app.use(bot.webhookCallback('/bot/'));

bot.on('text', async (ctx) => {
  ctx.session ??= { messages: [] };
  try {
    ctx.reply('Сообщение получено');
  } catch (e) {
    console.log(e);
  }
});

app.get('/bot', (req, res) => {
  res.send('Привет');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
