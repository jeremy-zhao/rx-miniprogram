import { log } from './log'
import type { mapping } from './types/reducers'

type PageOptions = WechatMiniprogram.Page.Options<WechatMiniprogram.Page.DataOption, WechatMiniprogram.Page.CustomOption>
  & { _rx_pageId?: number }

const pages: mapping[] = []

export function updatePageData(page: PageOptions, method: string) {
  const { _rx_pageId } = page
  if (_rx_pageId === null || _rx_pageId === undefined) return

  const mapping = pages[_rx_pageId]
  if (!mapping) return

  const app = getApp()
  const mapped = mapping(app.store)

  log('[Rx] mapped:', page.route, ':', method, '=>', mapped)
  page.setData(mapped)
}

// 连接 Page
export function connect(mapping: mapping, pageOptions: PageOptions) {

  const _rx_pageId = pages.length
  pages.push(mapping)

  const app = getApp()
  const mapped = mapping(app.store)
  const data = { ...pageOptions.data, ...mapped }

  const onLoad = pageOptions.onLoad
  const onShow = pageOptions.onShow

  const options: PageOptions = {
    ...pageOptions,
    data,
    _rx_pageId,
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
