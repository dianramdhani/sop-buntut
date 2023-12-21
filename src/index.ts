import 'dotenv/config'
import Processor from '@src/processor'
import { Analyzer } from '@src/analyzer'
import { env } from 'process'
import { resolve } from 'path'

// new Processor({ url: env.URL }).intercept()
new Analyzer(
  resolve(__dirname, '../logs/1703118376602', 'requests.json')
).read()
