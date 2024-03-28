import { register, isAction } from '../../src/index'
import type { IAction } from '../../src/index'

declare global {
  /** 定义登录状态 */
  interface LoginState extends IState {
    code?: string
  }

  /** 扩展 IStore */
  interface IStore {
    login?: LoginState
  }
}

/** 定义登录成功行为 */
interface LoginSuccessAction extends IAction {
  type: 'login/loginSuccess'
  code: string
}

// 注册登录组件
register<LoginState>({
  namespace: 'login',
  // 初始状态
  state: {
  },
  // 带有副作用的行为
  effects: {
    // 登录
    *login(_, { call, put }) {

      try {
        const { code } = (yield call(wx.login)) as WechatMiniprogram.LoginSuccessCallbackResult
        put<LoginSuccessAction>({ type: 'login/loginSuccess', code })
      }
      catch {
        wx.showToast({ title: '登录异常' })
      }
    }
  },
  // reduces 中定义的函数必须是纯函数
  reduces: {
    loginSuccess(state, action) {
      // 判断 action 类型，忽略错误调用
      if (!isAction<LoginSuccessAction>('login/loginSuccess', action)) return state

      const { code } = action

      // 返回新的登录状态
      return { ...state, code }
    }
  },
})
