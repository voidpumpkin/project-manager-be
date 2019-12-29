FROM node:latest
WORKDIR /app
COPY package.json /app 
COPY yarn.lock /app 
RUN yarn remove eslint-config-voidpumpkin
RUN yarn
COPY . /app
CMD yarn start