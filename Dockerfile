FROM node:20-bullseye-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-bullseye-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY server ./server
COPY --from=build /app/dist ./dist
RUN mkdir -p data
EXPOSE 80
CMD ["node", "server/index.js"]

