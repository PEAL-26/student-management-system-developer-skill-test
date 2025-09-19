FROM node:20-alpine

LABEL maintainer="peal26"

RUN apk upgrade --update-cache --available && \
    apk add --no-cache openssl && \
    rm -rf /var/cache/apk/*

WORKDIR /home/node/frontend

COPY . .

RUN chown -R node:node /home/node/frontend

USER node

RUN npm ci

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "preview"]
