FROM node:20

WORKDIR /usr/src/app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/ ./packages/
RUN pnpm install --frozen-lockfile
#RUN pnpm add -D nodemon ts-node
COPY . .
EXPOSE 3000
CMD ["pnpm", "--filter", "backend", "dev"]
