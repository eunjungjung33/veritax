/**
 * Column (칼럼) file parser shared by the web app and the build-time prerender script.
 *
 * A column is a plain text or Markdown file in `content/columns/`. It starts with a
 * header block (one `키: 값` per line, Korean or English keys), then a blank line, then
 * the body. Body paragraphs are separated by blank lines; `#`/`##` headings, `-` bullets,
 * `1.` numbered lists, `>` quotes and **bold** are supported.
 */

export type ColumnMeta = {
  slug: string;
  title: string;
  date: string;
  category: string;
  summary: string;
};

export type ColumnBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; ordered: boolean; items: string[] };

export type Column = ColumnMeta & { blocks: ColumnBlock[] };

const KEY_ALIASES: Record<string, keyof ColumnMeta> = {
  제목: "title", title: "title",
  날짜: "date", 일자: "date", date: "date",
  분류: "category", 카테고리: "category", category: "category",
  요약: "summary", summary: "summary", description: "summary",
  slug: "slug", 주소: "slug",
};

export function slugify(name: string) {
  return name
    .normalize("NFC")
    .replace(/\.(md|txt|markdown)$/iu, "")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/gu, "");
}

function normalizeDate(value: string) {
  const match = value.match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/u);
  if (!match) return value.trim();
  return `${match[1]}.${match[2].padStart(2, "0")}.${match[3].padStart(2, "0")}`;
}

export function parseColumn(fileName: string, raw: string): Column {
  const text = raw.replace(/^\uFEFF/u, "").replace(/\r\n?/gu, "\n");
  const lines = text.split("\n");
  let index = 0;
  if (lines[0]?.trim() === "---") index = 1;

  const meta: Partial<ColumnMeta> = {};
  for (; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.trim() === "" || line.trim() === "---") { index += 1; break; }
    const match = line.match(/^\s*([^:：]+)\s*[:：]\s*(.*)$/u);
    if (!match) break;
    const key = KEY_ALIASES[match[1].trim().toLowerCase()];
    if (key) meta[key] = match[2].trim().replace(/^["']|["']$/gu, "");
  }

  const blocks = parseBody(lines.slice(index));
  const firstParagraph = blocks.find((block) => block.type === "paragraph");
  return {
    slug: slugify(meta.slug || fileName),
    title: meta.title ?? fileName.replace(/\.(md|txt|markdown)$/iu, ""),
    date: normalizeDate(meta.date ?? ""),
    category: meta.category ?? "세무",
    summary: meta.summary ?? (firstParagraph && firstParagraph.type === "paragraph" ? firstParagraph.text.slice(0, 120) : ""),
    blocks,
  };
}

export function parseBody(lines: string[]): ColumnBlock[] {
  const blocks: ColumnBlock[] = [];
  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flush = () => {
    if (paragraph.length) { blocks.push({ type: "paragraph", text: paragraph.join("\n") }); paragraph = []; }
    if (list) { blocks.push({ type: "list", ...list }); list = null; }
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();
    if (trimmed === "") { flush(); continue; }

    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/u);
    if (heading) { flush(); blocks.push({ type: "heading", level: heading[1].length >= 3 ? 3 : 2, text: heading[2].trim() }); continue; }

    const quote = trimmed.match(/^>\s?(.*)$/u);
    if (quote) { flush(); blocks.push({ type: "quote", text: quote[1] }); continue; }

    const bullet = trimmed.match(/^[-*•]\s+(.+)$/u);
    const numbered = trimmed.match(/^\d+[.)]\s+(.+)$/u);
    if (bullet || numbered) {
      const ordered = Boolean(numbered);
      if (paragraph.length) flush();
      if (list && list.ordered !== ordered) flush();
      list ??= { ordered, items: [] };
      list.items.push((bullet ?? numbered)![1].trim());
      continue;
    }

    if (list) flush();
    paragraph.push(trimmed);
  }
  flush();
  return blocks;
}

/** Split inline text into plain and bold runs (`**bold**`). */
export function inlineRuns(text: string): Array<{ bold: boolean; text: string }> {
  return text.split(/(\*\*[^*]+\*\*)/u).filter(Boolean).map((part) =>
    part.startsWith("**") && part.endsWith("**") ? { bold: true, text: part.slice(2, -2) } : { bold: false, text: part },
  );
}

export function sortColumns<T extends ColumnMeta>(columns: T[]) {
  return [...columns].sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, "ko"));
}
