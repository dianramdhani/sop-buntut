import puppeteer from 'puppeteer-extra'
import pluginStealth from 'puppeteer-extra-plugin-stealth'
import cookies from '@cookies/1.json'
import { stdin, stdout } from 'process'
import { createInterface } from 'readline'
import { mkdir, writeFile } from 'fs/promises'
import { resolve } from 'path'
import type { Browser, Page, Protocol } from 'puppeteer'

export type Request = {
  url: string
  headers: any
  payload: any
  response: any
}

export default class Processor {
  private page?: Page
  private browser?: Browser
  private requests: (Request | string)[] = []
  private rl = createInterface({
    input: stdin,
    output: stdout,
  })

  constructor(
    private readonly config: {
      url: string
    }
  ) {
    const dirName = `../logs/${Date.now()}`
    this.rl.on('line', async (input) => {
      this.requests.push(`drl-${input}`)
      await mkdir(resolve(__dirname, dirName), { recursive: true })
      await writeFile(
        resolve(__dirname, dirName, 'requests.json'),
        JSON.stringify(this.requests, null, 2)
      )
      this.page?.screenshot({
        path: resolve(__dirname, dirName, `${input}.jpg`),
      })
    })
  }

  async intercept() {
    await this.init()
    await this.page?.setRequestInterception(true)
    this.page
      ?.on('request', (request) => request.continue())
      .on('response', async (response) => {
        if (response.headers()['content-type'] === 'application/json') {
          try {
            this.requests.push({
              url: response.url(),
              headers: response.request().headers(),
              payload: response.request().postData(),
              response: await response.json(),
            })
          } catch (error) {}
        }
      })
    await this.page?.setCookie(...(cookies as Protocol.Network.CookieParam[]))
    await this.page?.goto(this.config.url)
  }

  private async init() {
    puppeteer.use(pluginStealth())
    this.browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      headless: false,
      defaultViewport: null,
    })
    this.page = await this.browser.newPage()
  }
}
