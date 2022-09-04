FROM node as BUILDER 
LABEL maintainer="Hugo Leonardo da Mata Ribeiro"

WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

COPY src ./src

FROM node:16-alpine

ARG NODE_ENV

WORKDIR /usr/src/app

COPY --from=BUILDER /usr/src/app/ ./

EXPOSE 3000

CMD [ "npm", "start" ]