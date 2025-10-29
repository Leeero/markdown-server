const http = require("http"),
    url = require('url'),
    qs = require('querystring'),
    { exec } = require('child_process'), // 引入 exec 用于执行命令
    fs = require('fs'), // 引入 fs 用于文件操作
    path = require('path'), // 引入 path 用于处理路径
    os = require('os'), // 引入 os 获取临时目录
    mathjax = require("mathjax-node"),
    yuml2svg = require('yuml2svg');

mathjax.start();

// 查找 mmdc 命令的路径
const mmdcPath = path.join(__dirname, 'node_modules', '.bin', 'mmdc');
// 检查 mmdc 是否存在
if (!fs.existsSync(mmdcPath)) {
    console.warn("mmdc command not found in node_modules/.bin. Mermaid rendering might fail. Try running: npm install");
    // 可以考虑尝试全局 mmdc 或给出更明确的错误
}


const app = http.createServer((req,res)=>{
    let queryObj = qs.parse(url.parse(req.url).query),
        tex = queryObj.tex,
        yuml = queryObj.yuml,
        mermaid = queryObj.mermaid, // 获取 mermaid 参数
        theme = queryObj.theme,
        errFn = (msg, statusCode = 404)=>{ // 增加状态码参数
            console.error("Error:", msg); // 增加服务端日志
            res.writeHead(statusCode,{'Content-type':'text/html;charset=utf-8'});
            res.write(msg);
            res.end();
        },
        successFn = (result)=>{
            res.writeHead(200,{'Content-type':'image/svg+xml;charset=utf-8'});
            res.write(result);
            res.end();
        };

    if(yuml){
        yuml2svg(yuml,{isDark:theme === 'dark'}).then(v => {
            successFn(v);
        }).catch(e => {
            errFn('Yuml processing error: ' + (e.message || e), 500); // 返回更具体的错误
        });
    }else if(tex){
        mathjax.typeset({
            math:tex,
            format:'TeX',
            svg:true
        },data => {
            if(data.errors){
                 errFn('LaTeX processing error: ' + data.errors.join(', '), 500); // 返回错误
                 return;
            }
            if(theme === 'dark'){
                data.svg = data.svg.replace(/fill="currentColor"/g,'fill="#ffffff"');
            };
            successFn(data.svg);
        })
    }else if(mermaid){ // 添加 mermaid 处理逻辑
        // 创建临时文件来保存 Mermaid 代码
        const tempInputFile = path.join(os.tmpdir(), `mermaid-input-${Date.now()}.mmd`);
        const tempOutputFile = path.join(os.tmpdir(), `mermaid-output-${Date.now()}.svg`);
        const mermaidTheme = theme === 'dark' ? 'dark' : 'default'; // mmdc 的主题选项

        fs.writeFile(tempInputFile, mermaid, (err) => {
            if (err) {
                return errFn('Failed to write temporary Mermaid file.', 500);
            }

            // 创建 Puppeteer 配置文件路径
            const puppeteerConfigPath = path.join(__dirname, 'puppeteer.config.json');
            
            // 使用 Puppeteer 配置文件（如果存在），否则使用环境变量
            const command = fs.existsSync(puppeteerConfigPath)
                ? `"${mmdcPath}" -i "${tempInputFile}" -o "${tempOutputFile}" -t "${mermaidTheme}" -b transparent -p "${puppeteerConfigPath}"`
                : `"${mmdcPath}" -i "${tempInputFile}" -o "${tempOutputFile}" -t "${mermaidTheme}" -b transparent`;

            // 设置 Puppeteer/Chromium 环境变量，支持在 Docker 中以 root 运行
            const env = {
                ...process.env,
                PUPPETEER_ARGS: '--no-sandbox --disable-setuid-sandbox'
            };

            exec(command, { env }, (error, stdout, stderr) => {
                 // 清理临时输入文件
                fs.unlink(tempInputFile, (unlinkErr) => {
                    if (unlinkErr) console.error("Error deleting temp input file:", tempInputFile, unlinkErr);
                });

                if (error) {
                    return errFn(`Mermaid execution failed: ${error.message}\nStderr: ${stderr}`, 500);
                }
                if (stderr) {
                     console.warn("Mermaid stderr:", stderr); // 打印警告信息，但不一定失败
                }

                // 读取生成的 SVG 文件
                fs.readFile(tempOutputFile, 'utf8', (readErr, data) => {
                    // 清理临时输出文件
                    fs.unlink(tempOutputFile, (unlinkErr) => {
                         if (unlinkErr) console.error("Error deleting temp output file:", tempOutputFile, unlinkErr);
                    });

                    if (readErr) {
                        return errFn('Failed to read generated SVG file.', 500);
                    }
                    successFn(data); // 发送 SVG 数据
                });
            });
        });

    } else{
        // 提示信息中加入 mermaid
        errFn('Please pass LaTeX formula via `tex` parameter, `Yuml` expression using `yuml` parameter, or `Mermaid` code using `mermaid` parameter.');
    };
});
const port = 8001;
app.listen(port, () => {
    console.log(`Markdown server listening on port ${port}`); // 增加启动日志
});