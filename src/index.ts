import 'dotenv/config'
import Processor from '@src/processor'
import { env } from 'process'

new Processor({ url: env.URL }).intercept()
