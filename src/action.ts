import type { IAction } from './types/actions'

// 判断 Action 是否为指定类型
export function isAction<A extends IAction>(type: string, action: IAction): action is A {
  return action.type == type
}
