FROM node:18

WORKDIR /backend

COPY package*.json ./

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY .env.${NODE_ENV} .env

RUN npm install

RUN npm run build

COPY . .

CMD [ "node", "dist/main.js" ]
