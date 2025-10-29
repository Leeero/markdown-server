FROM node:18-slim

WORKDIR /usr/src/app

# 复制 package 文件
COPY package.json yarn.lock ./

# 安装依赖
RUN npm install -g yarn && \
    yarn install --frozen-lockfile

# 复制应用文件
COPY index.js ./

EXPOSE 8001

CMD [ "node", "index.js" ]
