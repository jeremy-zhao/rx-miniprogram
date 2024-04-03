import { LogLevel } from "./types/logs";

let _level: LogLevel = 'off'

/** 获取或设置 rx-miniprogram 的日志等级 */
export function logLevel(level: LogLevel | null | undefined) {

  if (level) {
    _level = level
  }

  return _level
}

/** 开始日志分组 */
export function logGroup(label?: string) {
  if (!_level || _level === 'off') return
  if (!console || !console.group) return

  console.group(label)
}

/** 结束日志分组 */
export function logGroupEnd() {
  if (!_level || _level === 'off') return
  if (!console || !console.groupEnd) return

  console.groupEnd()
}

/** 写日志 */
export function log(...args: any[]) {
  if (!_level || _level === 'off') return
  if (!console || !console[_level]) return

  console[_level](...args)
}
