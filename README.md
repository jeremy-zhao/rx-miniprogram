# rx-miniprogram <font size=3>v1.1.0</font>

微信小程序轻量级集中存储组件，仿照 DvaJS 的 API 定义。

## 最近更新
### v1.1.0
#### 1. 支持在 app.ts 中直接 import 模型
#### 2. Rx 日志打印控制
#### 3. 小程序 App 和 Page 中生命周期回调函数对 Promise 的顺序执行支持。例如：
```js
// 示例
Page({
  async onLoad() {
  },
  async onShow() {
    // 引入组件后，onShow() 会在 onLoad() 中所有异步过程执行完毕后开始执行
  }
})
```
<br>

## 快速上手

注：本文示例使用 TypeScript 开发小程序

#### 1. 使用 npm 安装 rx-miniprogram

```
npm i -S rx-miniprogram
```

#### 2. 点击菜单 -> 工具 -> 构建 npm

- 如果报错 `NPM packages not found.`，修改 `project.config.json` 文件(如下)。

```json
{
  "miniprogramRoot": "miniprogram/",
  "settings": {
    "packNpmManually": true,
    "packNpmRelationList": [
      {
        "packageJsonPath": "./package.json",
        "miniprogramNpmDistDir": "./miniprogram"
      }
    ]
  }
}
```

- 然后关掉小程序开发者工具，重新打开。
- 再次点击菜单 -> 工具 -> 构建 npm。
- 最后再次关闭开发者工具，并重新打开。

#### 3. 删除 `typings/index.d.ts` 中的 IAppOption 定义

```typescript
/// <reference path="./types/index.d.ts" />

// 下面的删除
// interface IAppOption {
//   globalData: {
//     userInfo?: WechatMiniprogram.UserInfo,
//   }
//   userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
// }
```

#### 4. 修改 `app.ts` 文件

```typescript
// app.ts
import { start } from 'rx-minisprogram'

start({
  // Rx 日志级别。默认值为 info
  logLevel: wx.getAccountInfoSync().miniProgram.envVersion == 'release' ? 'off' : 'debug',

  // 生命周期函数顺序执行设定。默认为所有生命周期函数
  promised: {
    // 指定 App 顺序执行的生命周期函数。默认为所有生命周期函数
    app: ['onLaunch', 'onHide'],
    // 指定 Page 顺序执行的生命周期函数。默认为所有生命周期函数
    page: ['onLoad', 'onShow'],
  },

  // 集中存储
  store: {},
})
```
#### 5. 注册登录模型

- 创建 `miniprogram/models/login.model.ts`

```typescript
// login.model.ts
import { register, isAction, IAction } from "rx-miniprogram";
import { login } from "../api/login.api";

// 全局定义
declare global {
  interface LoginContext {
    token: string;
  }

  /** 登录状态 */
  interface LoginState extends IState {
    /** 登录上下文信息 */
    loginContext?: LoginContext;
  }

  // 向 IStore 注入 LoginState
  interface IStore {
    login?: LoginState;
  }
}

// 定义登录完成行为。此行为对应 reduces.loginSuccess
interface LoginSuccessAction extends IAction {
  /** 定义 Action Type。格式为 [namespace]/[function name] */
  type: "login/loginSuccess";
  /** 登录上下文 */
  loginContext: LoginContext;
}

// 注册登录模型
register<LoginState>({
  // 这里建议和 IStore 中注入的 LoginState 名称保持一致
  namespace: "login",

  // 初始化状态
  state: {},

  // 带有副作用的 Action
  effects: {
    // 这里提供的是迭代器
    *login(action, { call, put }) {
      // 验证 Action Type
      if (!isAction("login/login", action)) return;

      // 通过 call 调用 wx.login
      const { code } = (yield call(
        wx.login
      )) as WechatMiniprogram.LoginSuccessCallbackResult;

      // 通过 call 调用服务端 login api
      const loginContext = (yield call(login, code)) as LoginContext;

      // 调用 loginSuccess，更新 LoginState
      yield put<LoginSuccessAction>({
        type: "login/loginSuccess",
        loginContext,
      });
    },
  },

  // reduces 中定义的函数必须是纯函数，不可使用 async await
  reduces: {
    // 登录完成后，通过此函数更新 LoginState 的状态
    loginSuccess(state, action) {
      // 验证 Action Type，并将 action 类型限制为 LoginSuccessAction
      if (!isAction<LoginSuccessAction>("login/loginSuccess", action))
        return state;

      const { loginContext } = action;
      return { ...state, loginContext };
    },
  },
});
```

#### 6. 修改首页

- `pages/index/index.ts`

```typescript
// index.ts
import { connect, dispatch } from "rx-miniprogram";

// 引入当前页面需要的模型
import "../../models/login.model";

// 将全局状态连接至页面
connect(
  // 定义 store 至 page data 的转换函数
  ({ login }) => ({ loginContext: login?.loginContext }),
  // PageOptions
  {
    // 转换函数中的返回值会被合并到 data 中，本例可访问 data.loginContext
    data: {},

    // 定义其它页面参数
    async onLoad() {
      // 调用 login.model.ts 中的 effects: login 函数
      await dispatch({ type: "login/login" });
    },
  }
);
```

- `pages/index/index.wxml`

```xml
<!-- index.wxml -->
<navigation-bar title="Weixin" back="{{false}}" color="black" background="#FFF"></navigation-bar>
<scroll-view class="scrollarea" scroll-y type="list">

  <view>
    <!-- 显示 data.loginContext.token -->
    <text>Login Token: {{loginContext.token}}</text>
  </view>

</scroll-view>
```
