import { apiBot } from '../api/api';
import { Markup } from 'telegraf';

export function createButtonsAnswer(question: any) {
  return Markup.inlineKeyboard(question.answers.map((answer: any) => Markup.button.callback(answer.content, `id=${answer.id};isAccept=${answer.isAccept}`)));
}

export async function initialize(bot: any) {
  const data: any = await apiBot.getQuestions();
  console.log('result', data.data);

  const question = data[0];

  const buttons = createButtonsAnswer(question);

  await bot.telegram.sendMessage(question.id, question.title, {
    reply_markup: buttons,
  });
}
