# Linux x64 with node preinstalled
FROM node:current-alpine

LABEL org.opencontainers.image.title="Metro madrid issues web" \
      org.opencontainers.image.description="Web server showing tweets about metro madrid service" \
      org.opencontainers.image.author="@juananthony"

RUN mkdir -p /usr/src/app

COPY . /usr/src/app

WORKDIR /usr/src/app

RUN npm install

ENTRYPOINT ["npm", "start"]