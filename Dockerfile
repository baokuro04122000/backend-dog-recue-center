FROM node:16

WORKDIR /app

COPY package*.json /app/
COPY tsconfig.json /app/
COPY tslint.json /app/

RUN npm install -g npm@9.5.0
RUN npm install
RUN npm install -g typescript

COPY . .

RUN npm run build 

EXPOSE 8080

CMD [ "npm", "start" ]
