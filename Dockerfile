FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json ./
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

# FIXED: Copying the /db folder from root instead of /src/db
COPY --from=build /app/drizzle.config.ts* ./ 
COPY --from=build /app/db ./db
COPY --from=build /app/src ./src

EXPOSE 3000
CMD ["npm", "start"]