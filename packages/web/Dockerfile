FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY ./packages/web ./packages/web

RUN npm -w packages/web run build

CMD npm -w packages/web run start