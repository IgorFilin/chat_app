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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const coreFunctions_js_1 = require("./functions/coreFunctions.js");
const botToken = process.env.BOT_TOKEN;
const bot = new telegraf_1.Telegraf(botToken);
// Настройка вебхука
const PORT = 4000;
const URL = process.env.URL || 'https://filin-hub.online';
// Настройка webhook
bot.telegram.setWebhook(`${URL}/bot/`);
app.use(bot.webhookCallback('/bot/'));
bot.action('callback_query', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const regx = /id=([^\s;]+);isAccept=(true|false)/;
    const data = ctx.data;
    const id = data.match(regx)[1];
    const isAccept = data.match(regx)[2];
    yield ctx.reply(`Правильный ли ответ ${isAccept}, его id = ${id}`);
}));
bot.launch().then(() => {
    (0, coreFunctions_js_1.initialize)(bot);
});
