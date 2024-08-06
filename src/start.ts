import { logLevel } from './log'
import { promisify } from './promisify'

import type { IAppOption } from './types/store'

export function start(options: WechatMiniprogram.App.Options<IAppOption>) {

  options.logLevel = options.logLevel || 'info'
  logLevel(options.logLevel)

  options.promised = options.promised || {}
  options.promised.app = options.promised.app || ['onLaunch', 'onShow', 'onHide']
  options.promised.page = options.promised.page || ['onLoad', 'onShow', 'onReady', 'onHide', 'onUnload', 'onRouteDone']

  for (let fn of options.promised.app) {
    options[fn] = promisify(options[fn])
  }

  App<IAppOption>(options)
}
