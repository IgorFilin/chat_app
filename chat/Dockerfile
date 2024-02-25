# этап сборки (build stage)
FROM node:18 as build-stage
WORKDIR /app
COPY package*.json ./
ARG VITE_APP_DOMEN_PORT
ARG VITE_APP_PROTOCOL
ARG VITE_APP_YA_CAPTCHA_KEY
ENV VITE_APP_HOST=${VITE_APP_DOMEN_PORT}
ENV VITE_APP_PROTOCOL=${VITE_APP_PROTOCOL}
ENV VITE_APP_PROTOCOL=${VITE_APP_YA_CAPTCHA_KEY}
RUN npm install
COPY . .
RUN npm run build

# этап production (production stage)
FROM nginx:stable-alpine as production-stage
COPY conf/default.conf /etc/nginx/conf.d/default.conf
COPY sound /var/chat/sound
COPY --from=build-stage /app/dist /var/chat/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
