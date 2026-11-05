import { Fragment } from "react";

// Splits a headline into words, each behind its own mask for the hero entrance.
export function RevealWords({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="mask-word">
            <span style={{ "--w": i } as React.CSSProperties}>{word}</span>
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </>
  );
}
