FROM node:18

WORKDIR /app/teacher_bot

COPY package*.json ./

RUN npm i

COPY . .

COPY .env.production .env

CMD [ "npm", "start" ]

