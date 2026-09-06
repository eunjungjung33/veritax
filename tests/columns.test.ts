import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { inlineRuns, parseColumn, slugify, sortColumns } from "../src/columns/parse";

const contentDir = new URL("../content/columns/", import.meta.url);

describe("tax column files", () => {
  it("parses a Korean header block and markdown body", () => {
    const column = parseColumn("2026-09-01-테스트 칼럼.txt", "제목: 테스트\n날짜: 2026년 9월 1일\n분류: 창업\n요약: 요약문\n\n첫 문단 **강조**\n둘째 줄\n\n## 소제목\n\n- 항목 1\n- 항목 2\n\n1. 순서 1\n2. 순서 2\n");
    expect(column).toMatchObject({ slug: "2026-09-01-테스트-칼럼", title: "테스트", date: "2026.09.01", category: "창업", summary: "요약문" });
    expect(column.blocks).toEqual([
      { type: "paragraph", text: "첫 문단 **강조**\n둘째 줄" },
      { type: "heading", level: 2, text: "소제목" },
      { type: "list", ordered: false, items: ["항목 1", "항목 2"] },
      { type: "list", ordered: true, items: ["순서 1", "순서 2"] },
    ]);
    expect(inlineRuns("첫 문단 **강조**")).toEqual([{ bold: false, text: "첫 문단 " }, { bold: true, text: "강조" }]);
  });

  it("falls back to the file name and first paragraph when the header is missing", () => {
    const column = parseColumn("메모.md", "본문만 있는 글입니다.");
    expect(column.title).toBe("메모");
    expect(column.summary).toBe("본문만 있는 글입니다.");
    expect(slugify("Hello World.md")).toBe("hello-world");
  });

  it("keeps every published column unique and newest first", () => {
    const files = readdirSync(contentDir).filter((name) => /\.(md|txt)$/iu.test(name));
    const columns = sortColumns(files.map((name) => parseColumn(name, readFileSync(new URL(name, contentDir), "utf8"))));
    expect(columns.length).toBeGreaterThan(0);
    expect(new Set(columns.map((column) => column.slug)).size).toBe(columns.length);
    for (const column of columns) {
      expect(column.title).not.toBe("");
      expect(column.date).toMatch(/^\d{4}\.\d{2}\.\d{2}$/u);
      expect(column.summary.length).toBeGreaterThan(10);
    }
    expect([...columns.map((column) => column.date)]).toEqual([...columns.map((column) => column.date)].sort().reverse());
  });
});
