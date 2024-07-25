"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiBot = void 0;
const axios_1 = __importDefault(require("axios"));
const mainInstance = axios_1.default.create({
    baseURL: process.env.URL,
    withCredentials: true,
});
exports.apiBot = {
    getQuestions() {
        return mainInstance.get('question-answer/dataQuestions/');
    },
};
