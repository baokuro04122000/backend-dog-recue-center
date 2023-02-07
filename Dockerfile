FROM node:19-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY tslint.json ./

RUN npm install npm@9.4.1 -g
RUN npm config set strict-ssl false
RUN npm config set registry https://registry.npmjs.org/
RUN npm install typescript -g
RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080
CMD npm start