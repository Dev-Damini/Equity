FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json ./
# Use official registry and fresh install to fix mirror/lockfile errors
RUN npm config set registry https://registry.npmjs.org/
RUN npm install --no-audit

FROM deps AS build
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
# Copying drizzle files so they are available at startup
COPY --from=build /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=build /app/src/db ./src/db

EXPOSE 3000
# Runs db:push (connected to Aiven) then starts the server
CMD ["npm", "start"]