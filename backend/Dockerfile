FROM node:20-alpine

LABEL maintainer="peal26"

RUN apk upgrade --update-cache --available && \
    apk add openssl && \
    rm -rf /var/cache/apk/*

WORKDIR /home/node/backend

COPY backend .

RUN chown -R node:node /home/node/backend

USER node

RUN npm ci

EXPOSE 5007

CMD ["npm", "run", "start"]