FROM node:16-alpine
RUN apk update && apk add \
    bash

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN npm install

COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh

EXPOSE 5000

ENTRYPOINT [ "/entrypoint.sh" ]

CMD ["npm", "run", "dev"]