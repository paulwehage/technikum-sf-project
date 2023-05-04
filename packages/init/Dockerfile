FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY ./packages/common ./packages/common
COPY ./packages/init ./packages/init

CMD npm -w packages/init run init