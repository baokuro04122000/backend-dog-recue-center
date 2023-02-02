FROM node:19-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY tslint.json ./

RUN npm install
RUN npm install typescript -g
RUN npm install -g npm@9.4.0

COPY . .


EXPOSE 9000

VOLUME ["/app/node_modules"]

CMD ["npm", "run", "dev"]