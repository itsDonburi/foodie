FROM nginx:1.27-alpine

COPY index.html favorites.html meal.js favorites.js instructions.js /usr/share/nginx/html/

EXPOSE 80
