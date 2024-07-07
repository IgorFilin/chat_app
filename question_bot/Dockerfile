FROM node:18

WORKDIR /app/teacher_bot

COPY package*.json ./

RUN npm i

COPY .env .env

COPY . .

CMD [ "npm", "start" ]

