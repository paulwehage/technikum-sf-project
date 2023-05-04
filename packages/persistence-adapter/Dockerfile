FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY ./packages/common ./packages/common
COPY ./packages/persistence-adapter ./packages/persistence-adapter

CMD npm -w packages/persistence-adapter run start