/** 行为接口 */
export interface IAction<T extends string = string> {
  /** 行为描述字符串。格式：'namespace/funcName' */
  type: T
}