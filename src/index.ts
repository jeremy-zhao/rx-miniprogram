import { logLevel } from './log'
import { start } from './start'
import { register } from './register'
import { connect } from './connect'
import { dispatch } from './dispatch'
import { isAction } from './action'

import type { IAction } from './types/actions'
import type { IAppOption } from './types/store'

export {
  /**
   * (弃用) 获取或设置 rx-miniprogram 的日志等级
   * @deprecated 请使用 startApp({ logLevel }) 设置日志等级
   */
  logLevel,
  start, register, connect, dispatch, isAction
}

export type { IAction, IAppOption }

export default {
  /**
   * (弃用) 获取或设置 rx-miniprogram 的日志等级
   * @deprecated 请使用 startApp({ logLevel }) 设置日志等级
   */
  logLevel,
  start, register, connect, dispatch, isAction
}
