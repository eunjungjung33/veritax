/**
 * Build step: turn every file in content/columns into a crawlable static page.
 *
 * For each column this writes dist/insights/<slug>/index.html — a copy of the built
 * index.html with the column's <title>, meta description, canonical URL and the article
 * text inside #root (React replaces it once the bundle loads). It also rewrites
 * dist/sitemap.xml so every column URL is listed for search engines.
 */
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseColumn, sortColumns, type Column, type ColumnBlock } from "../src/columns/parse.js";

const ROOT = resolve(fileURLToPath(new URL(".", import.meta.url)), "../..");
const SITE = "https://veritax.co.kr";
const CONTENT_DIR = join(ROOT, "content/columns");
const DIST = join(ROOT, "dist");

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/gu, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char);
}

function inline(text: string) {
  return escapeHtml(text).replace(/\*\*([^*]+)\*\*/gu, "<strong>$1</strong>").replace(/\n/gu, "<br>");
}

function renderBlock(block: ColumnBlock) {
  switch (block.type) {
    case "heading": return `<h${block.level}>${inline(block.text)}</h${block.level}>`;
    case "quote": return `<blockquote>${inline(block.text)}</blockquote>`;
    case "list": {
      const tag = block.ordered ? "ol" : "ul";
      return `<${tag}>${block.items.map((item) => `<li>${inline(item)}</li>`).join("")}</${tag}>`;
    }
    default: return `<p>${inline(block.text)}</p>`;
  }
}

function renderPage(template: string, column: Column) {
  const title = `${column.title} | 정은정 세무회계컨설팅`;
  const url = `${SITE}/insights/${encodeURI(column.slug)}`;
  const article = `<article><h1>${escapeHtml(column.title)}</h1><p>${escapeHtml(column.date)} · ${escapeHtml(column.category)}</p>${column.blocks.map(renderBlock).join("")}</article>`;
  return template
    .replace(/<title>[^<]*<\/title>/u, `<title>${escapeHtml(title)}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/u, `$1${escapeHtml(column.summary)}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/u, `$1${url}$2`)
    .replace('<div id="root"></div>', `<div id="root">${article}</div>`);
}

export async function loadColumns(dir = CONTENT_DIR) {
  const entries = await readdir(dir).catch(() => [] as string[]);
  const files = entries.filter((name) => /\.(md|txt)$/iu.test(name));
  const columns = await Promise.all(files.map(async (name) => parseColumn(name, await readFile(join(dir, name), "utf8"))));
  return sortColumns(columns);
}

async function main() {
  const template = await readFile(join(DIST, "index.html"), "utf8");
  const columns = await loadColumns();
  const seen = new Set<string>();
  for (const column of columns) {
    if (seen.has(column.slug)) throw new Error(`Duplicate column slug: ${column.slug}`);
    seen.add(column.slug);
    const dir = join(DIST, "insights", column.slug);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, "index.html"), renderPage(template, column), "utf8");
  }

  const sitemapPath = join(DIST, "sitemap.xml");
  const sitemap = await readFile(sitemapPath, "utf8");
  const urls = columns.map((column) => {
    const lastmod = column.date ? `<lastmod>${column.date.replaceAll(".", "-")}</lastmod>` : "";
    return `  <url><loc>${SITE}/insights/${encodeURI(column.slug)}</loc>${lastmod}<priority>0.7</priority></url>`;
  }).join("\n");
  await writeFile(sitemapPath, sitemap.replace("</urlset>", `${urls}\n</urlset>`), "utf8");
  console.log(`prerendered ${columns.length} column page(s)`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => { console.error(error); process.exit(1); });
}
