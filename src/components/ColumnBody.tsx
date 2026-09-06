import { Fragment } from "react";
import { inlineRuns, type ColumnBlock } from "../columns/parse";

function Inline({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, lineIndex) => (
        <Fragment key={lineIndex}>
          {lineIndex > 0 && <br />}
          {inlineRuns(line).map((run, runIndex) => run.bold ? <strong key={runIndex}>{run.text}</strong> : <Fragment key={runIndex}>{run.text}</Fragment>)}
        </Fragment>
      ))}
    </>
  );
}

export function ColumnBody({ blocks }: { blocks: ColumnBlock[] }) {
  return (
    <div className="column-body">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return block.level === 2 ? <h2 key={index}><Inline text={block.text} /></h2> : <h3 key={index}><Inline text={block.text} /></h3>;
          case "quote":
            return <blockquote key={index}><Inline text={block.text} /></blockquote>;
          case "list": {
            const items = block.items.map((item, itemIndex) => <li key={itemIndex}><Inline text={item} /></li>);
            return block.ordered ? <ol key={index}>{items}</ol> : <ul key={index}>{items}</ul>;
          }
          default:
            return <p key={index}><Inline text={block.text} /></p>;
        }
      })}
    </div>
  );
}
