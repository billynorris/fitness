const getKeyFromHeaders = (
  headers: { [key: string]: string },
  value: string,
): string | undefined => {
  const key = Object.keys(headers).find((y) => y.toUpperCase() === value.toUpperCase());

  if (!key) {
    return undefined;
  }

  return headers[key];
};

// eslint-disable-next-line import/prefer-default-export
export const getRateLimitData = (headers: { [key: string]: string }): {
  limit?: number,
  remaining?: number,
  reset?: number,
} => ({
  limit: parseInt(getKeyFromHeaders(headers, 'Fitbit-Rate-Limit-Limit') ?? '', 10),
  remaining: parseInt(getKeyFromHeaders(headers, 'Fitbit-Rate-Limit-Remaining') ?? '', 10),
  reset: parseInt(getKeyFromHeaders(headers, 'Fitbit-Rate-Limit-Reset') ?? '', 10),
});
