import { apiBot } from '../api/api';
const { Markup } = require('telegraf');

export async function getQuestionsData() {
  const questionData = await apiBot.getQuestions();
}

export function createButtonsAnswer(question) {
  return Markup.inlineKeyboard(question.answers.map((answer) => Markup.button.callback(answer.content, `id=${answer.id};isAccept=${answer.isAccept}`)));
}

export async function initialize(bot) {
  const data = await getQuestionsData();

  const question = data[0];

  const buttons = createButtonsAnswer(question);

  await bot.telegram.sendMessage(question.id, question.title, {
    reply_markup: buttons,
  });
}
