# Используем официальный образ Nginx
FROM nginx:alpine

# Копируем собранное приложение Angular в директорию Nginx
COPY ./dist/your-angular-app /usr/share/nginx/html

# Копируем пользовательскую конфигурацию Nginx, если она есть
COPY ./nginx.conf /etc/nginx/nginx.conf

# Экспонируем порт 80 для Nginx
EXPOSE 80

# Команда для запуска Nginx
CMD ["nginx", "-g", "daemon off;"]
