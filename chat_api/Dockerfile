FROM node:18

WORKDIR /backend

COPY package*.json ./

RUN npm install

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY .env.${NODE_ENV} .env

RUN npm run build

CMD [ "node", "dist/main.js" ]
