FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
# Keeping your custom registry setting
RUN npm config set registry https://npm.mirrors.msh.team
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit

FROM deps AS build
COPY . .
# This generates the /app/dist folder
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
# FIXED: Removed .env from this line
COPY package.json ./

EXPOSE 3000
CMD ["npm", "start"]