export class Ratelimit {
  static slidingWindow() {
    return () => {}
  }
  async limit() {
    return { success: true }
  }
}
