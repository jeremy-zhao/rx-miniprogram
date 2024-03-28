/**
 * 状态接口。
 * 用户可以在 .model.ts 文件中定义具体的状态类型，并继承此接口。
 */
interface IState {
}

/**
 * 集中存储接口
 * @remarks 您应该在每个模型中扩展此接口
 */
interface IStore {
  [propName: string]: IState
}

/** 应用程序设定 */
interface IAppOption {
  /** 集中存储 */
  store: IStore
}
