FROM node:18

WORKDIR /app/teacher_bot

RUN npm install -g typescript

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build

COPY .env.production .env

CMD [ "npm", "start" ]
