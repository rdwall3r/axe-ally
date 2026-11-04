export const normalizeUrl = (input: string): string => {
  let url: URL | undefined;

  try {
    url = new URL(input);
  } catch {}

  if (!url || !['http:', 'https:'].includes(url.protocol)) {
    throw new Error(
      `${input} is not a valid URL. Be sure to include 'http:' or 'https:'`,
    );
  }

  return url.href;
};

// JSON.stringify leaves "<" intact, so page HTML could otherwise close the XML
// tag that wraps it in the prompt and pass its text off as instructions. The
// escaped form is still the same JSON value.
export const toPromptJson = (value: unknown): string =>
  JSON.stringify(value).replaceAll('<', '\\u003c');
