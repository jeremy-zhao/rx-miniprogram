import { start, dispatch } from './src/index'
import './example/models/login.model'

declare global {

  interface IStore {
    sys?: {
      menuButtonRect: WechatMiniprogram.ClientRect
    }
  }

}

start({
  store: {
    sys: {
      menuButtonRect: wx.getMenuButtonBoundingClientRect()
    }
  },
  async onLaunch() {
    // 登录功能转移到 login.model.ts 中
    console.log('this app', this)
    await dispatch({ type: 'login/login' })
  },
})
