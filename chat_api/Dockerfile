FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY .env.${NODE_ENV} .env

RUN npm run build

CMD [ "node", "dist/main.js" ]
