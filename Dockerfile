FROM node:alpine

COPY . /app


WORKDIR /app/client

RUN npm install

RUN npm run build


WORKDIR /app/server

RUN npm install


EXPOSE 9111

CMD ["npm", "run", "start"]
