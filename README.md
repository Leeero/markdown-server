# Markdown-server

Markdown-server 提供了Markdown的数学公式 `LaTex`、流程图 `yUML` 以及 `Mermaid` 服务端渲染支持。

## 如何使用

### 本地运行

- clone 本项目
    - `git clone https://github.com/sbfkcel/markdown-server`
- 安装依赖
    - `npm install` 或 `yarn`
- 启动服务
    - `node index.js`

### Docker 运行

#### 1. 构建镜像

```bash
docker build -t markdown-server .
```

#### 2. 运行容器

```bash
docker run -d -p 8001:8001 --name markdown-server markdown-server
```

#### 3. 查看运行状态

```bash
docker ps
```

#### 4. 查看日志

```bash
docker logs markdown-server
```

#### 5. 停止和删除容器

```bash
# 停止容器
docker stop markdown-server

# 删除容器
docker rm markdown-server
```

#### 使用自定义端口

如果需要使用其他端口（例如 3000），可以修改映射端口：

```bash
docker run -d -p 3000:8001 --name markdown-server markdown-server
```

此时服务将在主机的 3000 端口上运行。

## 查看服务

可以通过以下示例用来查看服务是否正常。

- [（本地）LaTeX 数学公式](http://localhost:8001/?tex=x%20%3D%20%7B-b%20%5Cpm%20%5Csqrt%7Bb%5E2-4ac%7D%20%5Cover%202a%7D.)
- [（本地）yUML 流程图](http://localhost:8001/?yuml=%2F%2F%20%7Btype%3Aactivity%7D%0A%2F%2F%20%7Bgenerate%3Atrue%7D%0A%0A(start)-%3E%3Ca%3E%5Bkettle%20empty%5D-%3E(Fill%20Kettle)-%3E%7Cb%7C%0A%3Ca%3E%5Bkettle%20full%5D-%3E%7Cb%7C-%3E(Boil%20Kettle)-%3E%7Cc%7C%0A%7Cb%7C-%3E(Add%20Tea%20Bag)-%3E(Add%20Milk)-%3E%7Cc%7C-%3E(Pour%20Water)%0A(Pour%20Water)-%3E(end))
- [（本地）Mermaid 流程图](http://localhost:8001/?mermaid=graph%20TD%0A%20%20%20%20A%5BStart%5D%20--%3E%20B%7BIs%20it%20working%3F%7D%0A%20%20%20%20B%20--%3E%7CYes%7C%20C%5BGreat%5D%0A%20%20%20%20B%20--%3E%7CNo%7C%20D%5BDebug%5D%0A%20%20%20%20C%20--%3E%20E%5BEnd%5D%0A%20%20%20%20D%20--%3E%20E)

---

- [（在线）LaTeX 数学公式](http://towxml.vvadd.com/?tex=x%20%3D%20%7B-b%20%5Cpm%20%5Csqrt%7Bb%5E2-4ac%7D%20%5Cover%202a%7D.)
- [（在线）yUML 流程图](http://towxml.vvadd.com/?yuml=%2F%2F%20%7Btype%3Aactivity%7D%0A%2F%2F%20%7Bgenerate%3Atrue%7D%0A%0A(start)-%3E%3Ca%3E%5Bkettle%20empty%5D-%3E(Fill%20Kettle)-%3E%7Cb%7C%0A%3Ca%3E%5Bkettle%20full%5D-%3E%7Cb%7C-%3E(Boil%20Kettle)-%3E%7Cc%7C%0A%7Cb%7C-%3E(Add%20Tea%20Bag)-%3E(Add%20Milk)-%3E%7Cc%7C-%3E(Pour%20Water)%0A(Pour%20Water)-%3E(end))

## 修改服务端口

编辑 `index.js` 最后一行的端口号即可。
