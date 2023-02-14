FROM --platform=linux/x86_64 node:19-alpine

WORKDIR /app

COPY package*.json /app/
COPY tsconfig.json /app/
COPY tslint.json /app/

RUN npm install
RUN npm install typescript -g

COPY . .

RUN npm run build 

EXPOSE 8080

CMD [ "npm", "start" ]
