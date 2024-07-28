import { InlineKeyboard } from 'grammy';
import { apiBot } from '../api/api';

export function createButtonsAnswer(question: any) {
  const keyboard = new InlineKeyboard();

  question.answers.forEach((answer: any, index: any) => {
    keyboard.text(`${index + 1}`, `id=${answer.id};isAccept=${answer.isAccept}`);
  });

  return keyboard;
}

// Функция для генерации случайного индекса для получения вопроса, если только ещё небыло.
function getRandomQuestion(ctx: any): number {
  const randomQuestionIndex = Math.floor(Math.random() * ctx.session.questionList.length);
  if (ctx.session.questionIndexUsedList.length === ctx.session.questionList.length) {
    ctx.session.questionIndexUsedList = [];
    return randomQuestionIndex;
  }
  if (!ctx.session.questionIndexUsedList.includes(randomQuestionIndex)) {
    ctx.session.questionIndexUsedList.push(randomQuestionIndex);
    return randomQuestionIndex;
  } else {
    return getRandomQuestion(ctx);
  }
}

// Функция для получения вопроса и отправки его пользователю с вариантами ответа
export async function getQuestion(bot: any, ctx: any, isNextQuestion: boolean = true) {
  if (!ctx.session.questionList.length) {
    const { data }: any = await apiBot.getQuestions();
    ctx.session.questionList = data;
  }

  const sessionQuestionIndex = ctx.session?.questionIndex;
  let randomQuestion: number;

  if (isNextQuestion) {
    randomQuestion = getRandomQuestion(ctx);
    ctx.session.questionIndex = randomQuestion;
  } else {
    randomQuestion = sessionQuestionIndex;
  }

  const question = ctx.session.questionList[randomQuestion];

  const buttons = createButtonsAnswer(question);

  const questionTextHTML = `
  <code>
❓${question.question.title}

💡 Варианты ответа:

${question.answers.reduce((acc: any, curr: any, index: number) => {
  return (acc += `📌 ${index + 1} ${curr.content}\n`);
}, '')}
  </code>`;

  ctx.reply(questionTextHTML, {
    parse_mode: 'HTML', // Указываем, что сообщение в формате HTML
    reply_markup: buttons, // Прикрепляем клавиатуру
  });
}

// Функция для авторизации в системе
export async function login(textMessage: string) {
  const textMessageArr = textMessage.split(' ');
  const requestData = {
    email: textMessageArr[0],
    password: textMessageArr[1],
  };
  try {
    return await apiBot.login(requestData);
  } catch (e) {
    throw new Error('error');
  }
}
