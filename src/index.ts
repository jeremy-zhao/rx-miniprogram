import { logLevel } from './log'
import { register } from './register'
import { connect } from './connect'
import { dispatch } from './dispatch'
import { isAction } from './action'

import type { IAction } from './types/actions'

export { logLevel, register, connect, dispatch, isAction }

export type { IAction }

export default { logLevel, register, connect, dispatch, isAction }
