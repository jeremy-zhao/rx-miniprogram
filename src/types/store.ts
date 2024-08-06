import type { LogLevel } from './log'
import type { AppLifecycle, PageLifecycle } from './lifecycle'

declare global {

  /**
   * 状态接口。
   * 用户可以在 .model.ts 文件中定义具体的状态类型，并继承此接口。
   */
  interface IState { }

  /**
   * 集中存储接口
   * @remarks 您应该在每个模型中扩展此接口
   */
  interface IStore {
    [propName: string]: IState | undefined
  }

}

/** 应用程序设定 */
export interface IAppOption extends Record<string, any> {
  /** 日志等级。默认值为 info */
  logLevel?: LogLevel
  /** 指定基于 Promise 的生命周期函数 */
  promised?: {
    /**
     * 指定基于 Promise 的 App 生命周期函数
     * @default ['onLaunch', 'onShow', 'onHide']
     */
    app?: AppLifecycle[]
    /**
     * 指定基于 Promise 的 Page 生命周期函数
     * @default ['onLoad', 'onShow', 'onReady', 'onHide', 'onUnload', 'onRouteDone']
     */
    page?: PageLifecycle[]
  }
  /** 集中存储 */
  store: IStore
}
