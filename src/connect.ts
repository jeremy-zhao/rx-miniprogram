import { log } from './log'
import type { mapping } from './types/reducers'

type PageOptions = WechatMiniprogram.Page.Options<WechatMiniprogram.Page.DataOption, WechatMiniprogram.Page.CustomOption>
  & { __rxPageId__?: number }

const pages: mapping[] = []

export function updatePageData(page: PageOptions, method: string) {

  const { __rxPageId__ } = page
  if (__rxPageId__ === null || __rxPageId__ === undefined) return

  const mapping = pages[__rxPageId__]
  if (!mapping) return

  const app = getApp()
  const mapped = mapping(app.store)

  log('[Rx] mapped:', page.route, ':', method, '=>', mapped)
  page.setData(mapped)
}

// 连接 Page
export function connect(mapping: mapping, pageOptions: PageOptions) {

  const __rxPageId__ = pages.length
  pages.push(mapping)

  const app = getApp()
  const mapped = mapping(app.store)
  const data = { ...pageOptions.data, ...mapped }

  const onLoad = pageOptions.onLoad
  const onShow = pageOptions.onShow

  const options: PageOptions = {
    ...pageOptions,
    data,
    __rxPageId__,
    onLoad(query: Record<string, string | undefined>) {
      updatePageData(this, 'onLoad')
      if (onLoad && typeof onLoad === 'function') onLoad.call(this, query)
    },
    onShow() {
      updatePageData(this, 'onShow')
      if (onShow && typeof onShow === 'function') onShow.call(this)
    }
  }

  log('[Rx] connect:', options)
  Page(options)
}
