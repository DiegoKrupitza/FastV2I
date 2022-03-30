FROM node:16-alpine AS DEPENDENCIES

WORKDIR /usr/app

COPY package.json .

RUN yarn install --frozen-lockfile

FROM node:16-alpine AS BUILDER

COPY --from=DEPENDENCIES /usr/app/node_modules /usr/app/node_modules

WORKDIR /usr/app

COPY . .

RUN yarn build

FROM nginx:1.21.3-alpine

COPY --from=BUILDER /usr/app/dist /usr/share/nginx/html

COPY /nginx.conf  /etc/nginx/conf.d/default.conf

EXPOSE 80
