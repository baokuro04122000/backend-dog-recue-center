FROM --platform=linux/x86_64 node:19-alpine

WORKDIR /app

COPY package*.json /app/
COPY tsconfig.json /app/
COPY tslint.json /app/

RUN npm install -g npm@9.4.2
RUN npm cache --f clean
RUN npm config set registry https://registry.npmjs.org/
RUN npm install
RUN npm install typescript -g

COPY . .

RUN npm run build 

EXPOSE 8080

CMD [ "npm", "start" ]