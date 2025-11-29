FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# если у тебя TS:
# RUN npm run build

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

# если есть build:
# CMD ["node", "dist/main.js"]
# если без сборки, например обычный index.js:
CMD ["npm", "run", "start"]
