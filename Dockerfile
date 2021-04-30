FROM node:alpine

WORKDIR /usr/app

COPY package*.json ./
COPY .env .
COPY api ./api

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
