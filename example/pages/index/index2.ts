// 引用与当前页面相关的模型
// 模型必须被引用后方能使用
import '../../models/login.model'

import { connect } from '../../../src/index'

// 将当前页面连接至 rx-miniprogram
connect(
  // 将 store 映射至当前页面的 data
  ({ sys, login }) => ({ sys, login }),
  // PageOptions
  {
    // 页面加载时， rx-miniprogram 会将上面的函数返回值与自定义 data 合并
    data: {
      title: 'LOGIN 2'
    },

    onLoad() {
      debugger
    },

    onBack() {
      wx.navigateBack()
    }

  }
)

