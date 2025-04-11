FROM node:18.17.1-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
ENV PORT=8080
EXPOSE ${PORT}

CMD ["node", "server.js", "start"]
