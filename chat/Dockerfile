# этап сборки (build stage)
FROM node:18 as build-stage
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# этап production (production stage)
FROM nginx:stable-alpine as production-stage
COPY conf/default.conf /etc/nginx/conf.d/default.conf
COPY sound /var/chat/sound
COPY --from=build-stage /app/dist /var/chat/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
