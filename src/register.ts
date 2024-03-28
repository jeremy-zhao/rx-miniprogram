import { log, logGroup, logGroupEnd } from './log'
import type { Reducer, reduce, effect } from './types/reducers'

const reduces = new Map<string, reduce<any>>()
const effects = new Map<string, effect>()

// 注册 Model
export function register<S extends IState>(model: Reducer<S>) {
  const app = getApp()
  app.store[model.namespace] = { ...app.store[model.namespace], ...model.state }
  logGroup(`[Rx] register: ${model.namespace}`)

  if (model.effects) {
    for (const [key, value] of Object.entries(model.effects)) {

      const name = `${model.namespace}/${key}`
      log('[Rx] effect:', name, typeof value, value.constructor.name)

      if (!value || typeof (value) !== 'function' || !value.constructor.name) continue

      effects.set(name, value)
    }
  }

  if (model.reduces) {
    for (const [key, value] of Object.entries(model.reduces)) {

      const name = `${model.namespace}/${key}`
      log('[Rx] reduce:', name, typeof value, value.constructor.name)

      if (!value || typeof (value) !== 'function' || !value.constructor.name) continue

      if (effects.has(name)) {
        console.warn(`[Rx] warning: 在 ${model.namespace} 模块中，函数名 ${key} 同时存在于 effects 和 reduces，这样会导致 reduce 被忽略。`)
      }

      reduces.set(name, value)
    }
  }

  logGroupEnd();
}

export function getEffect(type: string) {
  return effects.get(type)
}

export function getReduce(type: string) {
  return reduces.get(type)
}
