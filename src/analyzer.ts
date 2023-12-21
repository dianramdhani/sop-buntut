import { Request } from '@src/processor'

export class Analyzer {
  raw: (Request | string)[] = []

  constructor(private readonly jsonPath: string) {}

  async read() {
    this.raw = (await import(this.jsonPath)).default
    console.log(
      this.raw.map((data) => (typeof data === 'object' ? data.url : data))
    )
  }
}
