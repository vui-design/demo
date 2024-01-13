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