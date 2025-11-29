FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build    # для CRA и Vite одинаково

FROM nginx:alpine

# удаляем дефолтный конфиг
RUN rm /etc/nginx/conf.d/default.conf

# кладём свой
COPY nginx.conf /etc/nginx/conf.d/default.conf

# статика
# CRA
COPY --from=build /app/build /usr/share/nginx/html
# Vite будет /app/dist (тогда исправь путь)

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
