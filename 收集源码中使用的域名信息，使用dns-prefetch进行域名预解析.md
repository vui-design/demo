##### 一、如何在工程化项目（如基于Vite+Vue3的项目）中，自动收集源码中使用的域名信息（如请求接口、JS、CSS或图片资源的所属域名），利用 <link ref="dns-prefetch" /> 标签进行域名预解析？

1、在工程根目录下新建一个 `scripts/dns-prefetch.js` 文件：

```javascript
const fs = require("fs");
const urlRegex = require("url-regex");
const { parse } = require("node-html-parser");
const { glob } = require("glob");

const pattern = /(https?:\/\/[^/]*)/i;
const urls = new Set();

function getResourceDomains() {
  const files = glob.sync("dist/**/*.{html,css,js}");

  for (const file of files) {
    const source = fs.readFileSync(file, "utf-8");
    const matches = source.match(urlRegex({ strict: true }));

    if (matches) {
      matches.forEach((url) => {
        const match = url.match(pattern);

        if (match && match[1]) {
          urls.add(match[1]);
        }
      });
    }
  }
};

function addLinks() {
  const files = glob.sync("dist/**/*.html");
  const links = [...urls].map((url) => `<link ref="dns-prefetch" href="${url}" />`).join("\n");

  for (const file of files) {
    const html = fs.readFileSync(file, "utf-8");
    const root = parse(html);
    const head = root.querySelector("head");

    head.insertAdjacentHTML("afterbegin", links);
    fs.writeFileSync(file, root.toString());
  }
};

function main() {
  getResourceDomains();
  addLinks();
};

main();
```

2、修改 `package.json` 中 `scripts` 下的 `build` 命令如下：

```javascript
{
  "scripts": {
    "dev": "vite",
    "build": "vite build && node ./scripts/dns-prefetch.js",
    "preview": "vite preview --port 8080",
    "type-check": "vue-tsc --noEmit"
  }
}
```

3、命令行执行 `npm run build` 即可完成收集和设置。

##### 二、为什么不封装成 Vite 插件？

上述方式可用于 `Vite`、`Vue-Cli` 或者 `React` 相关的各种工程脚手架。