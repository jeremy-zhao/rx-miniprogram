import { logLevel } from './log'
import { start } from './start'
import { register } from './register'
import { connect } from './connect'
import { dispatch } from './dispatch'
import { isAction } from './action'

import type { IAction } from './types/actions'
import type { IAppOption } from './types/store'

export { logLevel, start, register, connect, dispatch, isAction }

export type { IAction, IAppOption }

export default { logLevel, start, register, connect, dispatch, isAction }
