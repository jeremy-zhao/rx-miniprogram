import type { IAction } from './actions'

/**
 * 函数：用于选择状态的分量
 * @param x 当前状态
 */
export type select<S extends IState> = (x: S) => unknown

/** 副作用操作 */
export interface EffectOperations {
  /**
   * 选择当前（或指定命名空间）模型的状态分量
   * @example const sth = yield select(x => x.sth, 'namespace')
   * @param fn 提供一个用于选择状态分量的函数
   * @param ns 指定其它模型的状态。不填表示当前模型的状态
   */
  select: <S extends IState>(fn?: select<S>, ns?: string) => Promise<unknown>

  /**
   * 调用函数
   * @example const re = yield call(func, arg1, arg2, arg3...)
   * @param fn 需要调用的函数
   * @remarks 如果调用 class 中的方法，建议传入 `fn.bind(instance)`
   * @param args 依次传入的参数
   * @returns 函数返回值
   */
  call: <T = unknown>(fn: Function, ...args: unknown[]) => Promise<T>

  /**
   * 发起行为
   * @param action 行为上下文信息
   */
  put: <A extends IAction>(action: A) => Promise<void>
}

/** 定义一个会产生副作用的行为 */
export type effect = (action: IAction, op: EffectOperations) => Generator

/** 会产生副作用的行为集合 */
interface Effects {
  [funcName: string]: effect
}

/** 定义一个改变当前模块状态的行为（必须是纯函数） */
export type reduce<S extends IState> = (state: S, action: IAction) => S

/** 改变当前模块状态的行为集合 */
interface Reduces<S extends IState> {
  [funcName: string]: reduce<S>
}

/** 模型定义 */
export interface Reducer<S extends IState> {
  /** 模型的命名空间 */
  namespace: string
  /** 模型状态 */
  state: S
  /** 会产生副作用的行为集合 */
  effects?: Effects
  /** 改变当前模块状态的行为集合 */
  reduces?: Reduces<S>
}

/**
 * 定义一个从当前 IStore 中提取当前页面所需的模型状态
 * @param x 集中存储
 * @returns 页面状态
 */
export type mapping = (x: IStore) => object

/**
 * 执行指定的行为
 * @typeParam A 行为上下文类型，继承自 Rx.IAction
 * @param action 行为上下文信息
 */
export type dispatch = <A extends IAction>(action: A) => Promise<void>
