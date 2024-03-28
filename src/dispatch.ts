import { log, logGroup, logGroupEnd } from './log'
import { getEffect, getReduce } from './register'
import { updatePageData } from './connect'
import type { IAction } from './types/actions'
import type { select } from './types/reducers'

// 执行 Action
export async function dispatch<A extends IAction>(action: A): Promise<void> {

  const { type } = action
  if (!type) return

  const namespace = type.split('/')[0]

  const effect = getEffect(type)

  if (effect) {

    logGroup(`[Rx] effect: ${action.type}`)
    log('[Rx] action:', action)

    const iter = effect(action, {
      // select
      async select<S extends IState>(fn?: select<S>, ns?: string) {
        const app = getApp()
        const state = app.store[ns || namespace] as S

        const re = fn && typeof fn === 'function'
          ? await fn(state)
          : state

        log('[Rx] select:', re)
        return re
      },
      // call
      async call(fn, ...args) {
        const re = await fn(...args)
        log('[Rx] call:', fn.name, '->', args, '->', re)
        return re
      },
      // put
      async put(action) {
        log('[Rx] put:', action.type, action)
        await dispatch(action)
      },
    })

    let re

    while (true) {
      const { value, done } = iter.next(re)
      if (done) break

      try {
        if (value instanceof Promise) {
          re = await value
        }
        else {
          re = value
        }
      }
      catch (ex) {
        iter.throw(ex)
      }
    }

    logGroupEnd()
    return
  }

  const reduce = getReduce(action.type)

  if (reduce) {
    log('[Rx] reduce:', type, action)

    const app = getApp()
    const oldState = app.store[namespace]
    const newState = reduce(oldState, action)

    if (oldState == newState) return

    app.store[namespace] = newState

    const ps = getCurrentPages()

    for (let page of ps) {
      updatePageData(page, 'onReduce')
    }
  }
}
