import { parseColumn, sortColumns, type Column } from "./parse";

const files = import.meta.glob("/content/columns/*.{md,txt}", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

export const columns: Column[] = sortColumns(
  Object.entries(files).map(([path, raw]) => parseColumn(path.split("/").pop() ?? path, raw)),
);

export function findColumn(slug: string) {
  return columns.find((column) => column.slug === slug);
}
