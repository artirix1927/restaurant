FROM node:20-alpine

#RUN apt-get update && apt-get install -y libpq-dev build-essential

WORKDIR /reactjs

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]