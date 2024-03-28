interface IStore {
  sys: {
    menuButtonRect: WechatMiniprogram.ClientRect
  }
}

App<IAppOption>({
  store: {
    sys: {
      menuButtonRect: wx.getMenuButtonBoundingClientRect()
    }
  },
  onLaunch() {
    // 登录功能转移到 login.model.ts 中
  },
})