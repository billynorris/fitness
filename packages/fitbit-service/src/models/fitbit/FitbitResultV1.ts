export default class FitbitResultV1<T> {
  rateLimit: {
    limit?: number,
    remaining?: number,
    reset?: number,
  };

  data: T;
}
