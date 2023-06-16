export class Logger {
  info(e: unknown) {
    return console.info(this.format(e))
  }
  error(e: unknown) {
    return console.error(this.format(e))
  }
  private format(e: unknown) {
    return `[${new Date().toISOString()}]: ${this.toError(e).message}`
  }
  private toError(e: unknown): Error {
    if (e instanceof Error) {
      return e
    }
    if (typeof e === 'string') {
      return new Error(e)
    }
    return new Error(JSON.stringify(e))
  }
}
