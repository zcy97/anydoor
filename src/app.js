const http = require("http");
const chalk = require("chalk");
const path = require("path");
const conf = require("./config/defaultConfig");
const fs = require("fs");
const join = require("path");

const server = http.createServer((req, res) => {
    const filePath = path.join(conf.root, req.url);
    fs.stat(filePath, (err, stats) => {
        if (err) {
            res.statusCode = 404;
            res.setHeader("Content-Type", "text/plain");
            res.end(`${filePath} is not a directory or file`);
            return;
        }
        if (stats.isFile()) {
            //判断如果返回的是文件类型
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/plain");
            fs.createReadStream(filePath).pipe(res);
        } else if (stats.isDirectory()) {
            //判断如果返回的是文件夹类型
            fs.readFile(filePath, (err, files) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "text/plain");
                res.end(files, join(","));
            });
        }
    });
});

server.listen(conf.port, conf.hostname, () => {
    const addr = `http://${conf.hostname}:${conf.port}`;
    console.log(`Server started at ${chalk.green(addr)}`);
});