"use client";

type HtmlIslandProps = {
  html: string;
};

export function HtmlIsland({ html }: HtmlIslandProps) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
