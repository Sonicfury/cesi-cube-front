FROM jbloup/node16 as setup

RUN apk update && npm i -g @angular/cli

COPY . /home/node/app

RUN npm i

FROM setup as build

RUN ng build --prod

FROM setup as serve

EXPOSE 4200

CMD ["ng", "serve"]

