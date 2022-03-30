FROM node:16-alpine AS DEPENDENCIES

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn install --frozen-lockfile

FROM node:16-alpine AS BUILDER

COPY --from=DEPENDENCIES /app/node_modules /app/node_modules

WORKDIR /app

COPY . .

RUN  yarn build

FROM node:16-alpine

WORKDIR /app

RUN apk add --no-cache bash && yarn global add node-wait-for-it

COPY --from=DEPENDENCIES /app/node_modules /app/node_modules
COPY package.json /app/
RUN npm prune --production && rm package.json

COPY --from=BUILDER /app/dist/ /app/dist/

EXPOSE 8888

CMD [ "sh", "-c", "wait-for-it -t 0 ${EUREKA_SERVER_ADDRESS}:8761 && node /app/dist/main.js"]
