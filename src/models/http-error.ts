class HttpError extends Error {
  constructor(message: string, private code?: number) {
    super(message);
  }
}

export default HttpError;
