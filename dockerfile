FROM node:18-slim

WORKDIR /usr/src/app

# 启用 Corepack 来管理 yarn（Node.js 18+ 自带）
RUN corepack enable

# 复制 package 文件
COPY package.json yarn.lock ./

# 安装依赖
RUN yarn install --frozen-lockfile

# 复制应用文件
COPY index.js ./

EXPOSE 8001

CMD [ "node", "index.js" ]
