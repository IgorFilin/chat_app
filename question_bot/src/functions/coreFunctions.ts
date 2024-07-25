import { apiBot } from '../api/api';
import { Markup } from 'telegraf';

export async function getQuestionsData(): Promise<any> {
  console.log('getQuestionsData inside');
  return await apiBot.getQuestions();
}

export function createButtonsAnswer(question: any) {
  console.log('createButtonsAnswer inside', question);
  return Markup.inlineKeyboard(question.answers.map((answer: any) => Markup.button.callback(answer.content, `id=${answer.id};isAccept=${answer.isAccept}`)));
}

export async function initialize(bot: any) {
  console.log('initialize inside');
  const data = await getQuestionsData();

  const question = data[0];

  const buttons = createButtonsAnswer(question);

  await bot.telegram.sendMessage(question.id, question.title, {
    reply_markup: buttons,
  });
}
