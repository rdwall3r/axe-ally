export const normalizeUrl = (input) => {
  let url;

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
