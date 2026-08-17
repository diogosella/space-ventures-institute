export type ParsedInternshipContent = {
  overview: string[];
  responsibilities: string[];
  qualifications: string[];
  whyJoinUs: string[];
};

export type StructuredOverviewBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "heading"; text: string }
  | { kind: "group"; title: string; items: string[] }
  | { kind: "bullets"; items: string[] };

const normalizeText = (value: string) => value.replace(/\r/g, "").replace(/\u00A0/g, " ").trim();

const HTML_EMOJI_ENTITY_RE = /&#x1[fF][\da-fA-F]+;|&#(?:1[0-9]{5}|[2-9][0-9]{4});/gi;
const UNICODE_EMOJI_RE = /\p{Extended_Pictographic}\uFE0F?/gu;

/** Remove emoji characters and numeric HTML emoji entities from CMS copy. */
export function stripEmojis(value: string): string {
  return value
    .replace(HTML_EMOJI_ENTITY_RE, "")
    .replace(UNICODE_EMOJI_RE, "")
    .replace(/^[ \t]+/gm, "")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

/** Strip CMS embeds and collapse noisy line breaks before parsing. */
export function sanitizeInternshipDescription(raw?: string): string | undefined {
  if (!raw) return undefined;

  let text = raw.replace(/\r/g, "").replace(/\u00A0/g, " ");
  text = text.replace(/hbspt\.forms\.create\(\{[\s\S]*?\}\);?/gi, "");
  text = text.replace(/\n{3,}/g, "\n\n").trim();
  text = stripEmojis(decodeHtmlEntities(text));

  return text || undefined;
}

export function decodeHtmlEntities(value: string): string {
  const decoded = value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number.parseInt(dec, 10)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  return stripEmojis(decoded);
}

const cleanItem = (value: string) =>
  normalizeText(value)
    .replace(/^[-\u2022\u25CF\u25A0\u25AA\u25E6]+\s*/, "")
    .trim();

const isOverviewHeading = (value: string) => /^overview$/i.test(value);
const isResponsibilitiesHeading = (value: string) => /^key responsibilities$/i.test(value);
const isQualificationsHeading = (value: string) =>
  /^qualifications and skills$/i.test(value) || /^qualifications\s*&\s*skills$/i.test(value);
const isWhyJoinUsHeading = (value: string) => /^why join us\??$/i.test(value);

/**
 * Parses a single Strapi long-text field into sections, using blank-line blocks
 * and known section headings (same convention as Bootcamp University internships).
 */
export function parseInternshipContent(raw?: string): ParsedInternshipContent {
  const result: ParsedInternshipContent = {
    overview: [],
    responsibilities: [],
    qualifications: [],
    whyJoinUs: [],
  };

  const cleaned = sanitizeInternshipDescription(raw);
  if (!cleaned) return result;

  const blocks = cleaned
    .split(/\n\s*\n+/)
    .map(normalizeText)
    .filter(Boolean);

  let currentSection: keyof ParsedInternshipContent = "overview";

  for (const block of blocks) {
    if (isOverviewHeading(block)) {
      currentSection = "overview";
      continue;
    }

    if (isResponsibilitiesHeading(block)) {
      currentSection = "responsibilities";
      continue;
    }

    if (isQualificationsHeading(block)) {
      currentSection = "qualifications";
      continue;
    }

    if (isWhyJoinUsHeading(block)) {
      currentSection = "whyJoinUs";
      continue;
    }

    result[currentSection].push(cleanItem(block));
  }

  return result;
}

const WORK_ON_HEADING_RE = /^what you['’]ll work on:?$/i;
const STANDALONE_SECTION_HEADING_RE =
  /^(about the role|what you['’]ll do|what we['’]re looking for|learning first|why this internship matters|join us)$/i;
const GROUP_TITLE_RE = /^.+:\s*$/;

const isDivider = (value: string) => /^[-—–]\s*$/.test(value.trim());

const isWorkOnHeading = (value: string) =>
  WORK_ON_HEADING_RE.test(decodeHtmlEntities(value).trim().replace(/:\s*$/, ""));

const isGroupTitle = (value: string) => {
  const text = decodeHtmlEntities(value).trim();
  return GROUP_TITLE_RE.test(text) && !isWorkOnHeading(text) && text.length <= 150;
};

const isSectionHeading = (value: string) => {
  const text = decodeHtmlEntities(value).trim();
  if (!text || isDivider(text)) return false;
  if (isWorkOnHeading(text)) return true;
  if (STANDALONE_SECTION_HEADING_RE.test(text.replace(/:\s*$/, ""))) return true;
  return false;
};

const normalizeHeading = (value: string) =>
  decodeHtmlEntities(value)
    .trim()
    .replace(/:\s*$/, "");

const splitHeadingBody = (value: string) => {
  const text = decodeHtmlEntities(value);
  const newline = text.indexOf("\n");
  if (newline === -1) {
    return { heading: undefined, body: text.trim() };
  }

  const heading = text.slice(0, newline).trim();
  const body = text.slice(newline + 1).trim();

  if (!heading || !body) {
    return { heading: undefined, body: text.trim() };
  }

  if (
    STANDALONE_SECTION_HEADING_RE.test(heading.replace(/:\s*$/, "")) ||
    isWorkOnHeading(heading) ||
    heading.length <= 80
  ) {
    return { heading, body };
  }

  return { heading: undefined, body: text.trim() };
};

const isListStyleBlock = (value: string) => {
  const text = value.trim();
  if (!text) return false;
  if (text.length > 280) return false;

  const sentenceCount = text.split(/\.\s+/).filter(Boolean).length;
  return sentenceCount <= 2;
};

const collectSectionContent = (
  blocks: string[],
  start: number,
  options?: { defaultToParagraphs?: boolean },
) => {
  const paragraphs: string[] = [];
  const items: string[] = [];
  let i = start;
  const defaultToParagraphs = options?.defaultToParagraphs ?? false;

  while (i < blocks.length) {
    const block = blocks[i];
    if (isSectionHeading(block) || isGroupTitle(block) || splitHeadingBody(block).heading) {
      break;
    }

    const text = decodeHtmlEntities(block).trim();
    if (!text) {
      i++;
      continue;
    }

    if (isDivider(text)) {
      i++;
      break;
    }

    if (items.length === 0 && paragraphs.length === 0) {
      if (!defaultToParagraphs && isListStyleBlock(text)) {
        items.push(text);
      } else {
        paragraphs.push(text);
      }
    } else if (items.length > 0) {
      if (isListStyleBlock(text)) {
        items.push(text);
      } else {
        break;
      }
    } else {
      paragraphs.push(text);
    }

    i++;
  }

  return { paragraphs, items, consumed: i - start };
};

/**
 * Turns flat overview paragraphs into headings, bullet lists, and titled groups
 * for CMS copy that nests "What You'll Work On" or short section blocks in Overview.
 */
export function structureOverviewBlocks(blocks: string[]): StructuredOverviewBlock[] {
  const result: StructuredOverviewBlock[] = [];
  let i = 0;

  while (i < blocks.length) {
    const raw = blocks[i];
    const split = splitHeadingBody(raw);

    if (split.heading) {
      result.push({ kind: "heading", text: normalizeHeading(split.heading) });
      if (split.body) {
        result.push({ kind: "paragraph", text: split.body });
      }
      i++;

      const listFollows = split.body?.trim().endsWith(":");
      const section = collectSectionContent(blocks, i, {
        defaultToParagraphs: Boolean(split.body && !listFollows),
      });
      for (const paragraph of section.paragraphs) {
        result.push({ kind: "paragraph", text: paragraph });
      }
      if (section.items.length > 0) {
        result.push({ kind: "bullets", items: section.items });
      }
      i += section.consumed;
      continue;
    }

    if (isSectionHeading(raw)) {
      const heading = normalizeHeading(raw);
      result.push({ kind: "heading", text: heading });
      i++;

      if (isWorkOnHeading(heading)) {
        while (i < blocks.length && isGroupTitle(blocks[i])) {
          const groupTitle = normalizeHeading(blocks[i]);
          i++;
          const items: string[] = [];

          while (
            i < blocks.length &&
            !isGroupTitle(blocks[i]) &&
            !isSectionHeading(blocks[i]) &&
            !splitHeadingBody(blocks[i]).heading
          ) {
            const text = decodeHtmlEntities(blocks[i]).trim();
            if (text && !isDivider(text)) {
              items.push(text);
            }
            i++;
          }

          result.push({ kind: "group", title: groupTitle, items });
        }
        continue;
      }

      const section = collectSectionContent(blocks, i);
      for (const paragraph of section.paragraphs) {
        result.push({ kind: "paragraph", text: paragraph });
      }
      if (section.items.length > 0) {
        result.push({ kind: "bullets", items: section.items });
      }
      i += section.consumed;
      continue;
    }

    const text = decodeHtmlEntities(raw).trim();
    if (!text || isDivider(text)) {
      i++;
      continue;
    }

    result.push({ kind: "paragraph", text });
    i++;
  }

  return result;
}

export function splitWhyJoinItem(item: string) {
  const cleaned = cleanItem(item);
  const match = cleaned.match(/^([^:]+):\s*(.+)$/);

  if (!match) {
    return {
      title: "",
      description: cleaned,
    };
  }

  return {
    title: `${match[1].trim()}:`,
    description: match[2].trim(),
  };
}

export function isParsedInternshipDescriptionEmpty(parsed: ParsedInternshipContent): boolean {
  return (
    parsed.overview.length === 0 &&
    parsed.responsibilities.length === 0 &&
    parsed.qualifications.length === 0 &&
    parsed.whyJoinUs.length === 0
  );
}
