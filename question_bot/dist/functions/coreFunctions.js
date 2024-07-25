"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuestionsData = getQuestionsData;
exports.createButtonsAnswer = createButtonsAnswer;
exports.initialize = initialize;
const api_js_1 = require("../api/api.js");
const telegraf_1 = require("telegraf");
function getQuestionsData() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield api_js_1.apiBot.getQuestions();
    });
}
function createButtonsAnswer(question) {
    return telegraf_1.Markup.inlineKeyboard(question.answers.map((answer) => telegraf_1.Markup.button.callback(answer.content, `id=${answer.id};isAccept=${answer.isAccept}`)));
}
function initialize(bot) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield getQuestionsData();
        const question = data[0];
        const buttons = createButtonsAnswer(question);
        yield bot.telegram.sendMessage(question.id, question.title, {
            reply_markup: buttons,
        });
    });
}
