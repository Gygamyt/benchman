FROM node:20
WORKDIR /usr/src/app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/ ./packages/
RUN pnpm install
COPY . .
EXPOSE 5173
CMD ["pnpm", "--filter", "frontend", "dev"]