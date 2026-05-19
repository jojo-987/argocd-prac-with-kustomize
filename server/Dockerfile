FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

ENV ENV=dev

EXPOSE 5000
EXPOSE 5001

CMD ["node", "index.js"]

