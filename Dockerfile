FROM node:22.5.0-slim as base

FROM base as build
WORKDIR /build

COPY . .

RUN yarn install --ignore-engines --frozen-lockfile --production=false
RUN yarn build

RUN yarn install --ignore-engines --production --prefer-offline
RUN yarn cache clean

FROM base
WORKDIR /app
EXPOSE 80

COPY --from=build /build/node_modules ./node_modules
COPY --from=build /build/dist ./dist
COPY --from=build /build/package.json ./package.json

CMD yarn start:prod

