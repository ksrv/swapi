export default class HttpError extends Error {
  constructor (code, ...args) {
    super(...args);
    this.code = code;
  }
};