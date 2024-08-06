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
  logLevel: wx.getAccountInfoSync().miniProgram.envVersion == 'release' ? 'off' : 'debug',
  // promised: {
  //   app: ['onLaunch', 'onHide'],
  //   page: ['onLoad', 'onShow'],
  // },
  store: {
    sys: {
      menuButtonRect: wx.getMenuButtonBoundingClientRect()
    }
  },
  // onLaunch() {
  //   console.log('this app', this)
  //   wx.onUnhandledRejection(e => {
  //     console.error('aa')
  //   })
  //   wx.onError(() => {
  //     console.error('ee')
  //   })
  //   // 登录功能转移到 login.model.ts 中
  //   // await dispatch({ type: 'login/login' })

  //   // throw new Error('App onLaunch')
  // },
  onLaunch() {
    console.log('App onLaunch')
    throw new Error('App onLaunch')
  },
  onShow() {
    console.log('App onShow')
    throw new Error('App onShow')
  },
  onUnhandledRejection() {
    console.error('a')
  },
  onError() {
    console.error('e')
  },
})

