FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY ./packages/common ./packages/common
COPY ./packages/crawler ./packages/crawler

CMD npm -w packages/crawler run start