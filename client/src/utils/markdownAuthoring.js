export function getMarkdownContinuation(value, selectionStart, selectionEnd) {
  if (selectionStart !== selectionEnd) {
    return null;
  }

  const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
  const beforeCursor = value.slice(lineStart, selectionStart);
  const afterCursor = value.slice(selectionStart);
  const unorderedMatch = beforeCursor.match(/^(\s*)([-*+])\s(.*)$/);

  if (unorderedMatch) {
    const [, indent, marker, content] = unorderedMatch;

    if (!content.trim()) {
      return {
        value: `${value.slice(0, lineStart)}${afterCursor}`,
        cursor: lineStart,
      };
    }

    const insert = `\n${indent}${marker} `;

    return {
      value: `${value.slice(0, selectionStart)}${insert}${afterCursor}`,
      cursor: selectionStart + insert.length,
    };
  }

  const orderedMatch = beforeCursor.match(/^(\s*)(\d+)([.)])\s(.*)$/);

  if (orderedMatch) {
    const [, indent, number, delimiter, content] = orderedMatch;

    if (!content.trim()) {
      return {
        value: `${value.slice(0, lineStart)}${afterCursor}`,
        cursor: lineStart,
      };
    }

    const insert = `\n${indent}${Number(number) + 1}${delimiter} `;

    return {
      value: `${value.slice(0, selectionStart)}${insert}${afterCursor}`,
      cursor: selectionStart + insert.length,
    };
  }

  const quoteMatch = beforeCursor.match(/^(\s*>\s?)(.*)$/);

  if (quoteMatch) {
    const [, prefix, content] = quoteMatch;

    if (!content.trim()) {
      return {
        value: `${value.slice(0, lineStart)}${afterCursor}`,
        cursor: lineStart,
      };
    }

    const insert = `\n${prefix}`;

    return {
      value: `${value.slice(0, selectionStart)}${insert}${afterCursor}`,
      cursor: selectionStart + insert.length,
    };
  }

  return null;
}
