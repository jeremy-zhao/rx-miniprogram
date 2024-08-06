import { log } from './log'
import { promisify } from './promisify'
import { getDefaultState, getStore } from './register'

import type { mapping } from './types/reducers'

type PageOptions = WechatMiniprogram.Page.Options<WechatMiniprogram.Page.DataOption, WechatMiniprogram.Page.CustomOption>
  & { __rxPageId__?: number }

const pages: mapping[] = []

export function updatePageData(page: PageOptions, method: string) {

  const { __rxPageId__ } = page
  if (__rxPageId__ === null || __rxPageId__ === undefined) return

  const mapping = pages[__rxPageId__]
  if (!mapping) return

  const store = getStore()
  const mapped = mapping(store)

  log('[Rx] mapped:', page.route, ':', method, '=>', mapped)
  page.setData(mapped)
}

// 连接 Page
export function connect(mapping: mapping, pageOptions: PageOptions) {

  const __rxPageId__ = pages.length
  pages.push(mapping)

  const store: IStore = getStore()

  const defaultStore = Object.entries(store)
    .reduce((s: IStore, [key, value]) => {
      s[key] = getDefaultState(key) || value as IState
      return s
    }, {})

  const mapped = mapping(defaultStore)
  const data = { ...pageOptions.data, ...mapped }

  const options: PageOptions = {
    ...pageOptions,
    data,
    __rxPageId__,
  }

  for (let fn of getApp()?.promised?.page || []) {

    switch (fn) {
      case 'onLoad':
      case 'onShow':
        options[fn] = promisify(function (this: any) { updatePageData(this, fn) }, options[fn])
        break
      default:
        options[fn] = promisify(options[fn])
        break
    }

  }

  log('[Rx] connect:', options)
  Page(options)
}
