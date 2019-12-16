FROM node:latest
WORKDIR /app
COPY package.json /app 
RUN yarn
COPY . /app
CMD yarn start