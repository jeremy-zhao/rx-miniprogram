import { log } from './log'
import { promisify } from './promisify'
import { getStore } from './register'

import type { mapping } from './types/reducers'

type Page = WechatMiniprogram.Page.Instance<Record<string, any>, Record<string, any>>
  & { __rxPageId__?: number }

type PageOptions = WechatMiniprogram.Page.Options<WechatMiniprogram.Page.DataOption, WechatMiniprogram.Page.CustomOption>
  & { __rxPageId__?: number }

const pages: mapping[] = []

export function updatePageData(page: Page, method: string) {

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

  const options: PageOptions = {
    ...pageOptions,
    __rxPageId__,
    async onLoad(query) {
      updatePageData(this, 'onLoad')

      if (pageOptions.onLoad && pageOptions.onLoad.call) {
        await pageOptions.onLoad.call(this, query)
      }
    },
    async onShow() {
      updatePageData(this, 'onShow')

      if (pageOptions.onShow && pageOptions.onShow.call) {
        await pageOptions.onShow.call(this)
      }
    },
  }

  for (let fn of getApp()?.promised?.page || []) {
    options[fn] = promisify(options[fn])
  }

  log('[Rx] connect:', options)
  Page(options)
}
