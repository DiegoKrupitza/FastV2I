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

COPY --from=DEPENDENCIES /app/node_modules /app/node_modules
COPY package.json /app/
RUN npm prune --production && rm package.json

COPY --from=BUILDER /app/dist/ /app/dist/

EXPOSE 8888

CMD [ "node", "/app/dist/main.js"]
