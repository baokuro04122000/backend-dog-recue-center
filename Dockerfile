FROM --platform=linux/amd64 node:19-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY tslint.json ./

RUN npm install
RUN npm install typescript -g

COPY . .

RUN npm run build 

EXPOSE 8080