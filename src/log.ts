import { LogLevel } from "./types/logs";

let level: LogLevel = 'off'

/** 获取或设置 rx-miniprogram 的日志等级 */
export function logLevel(level: LogLevel | null | undefined) {

  if (level) {
    level = level
  }

  return level
}

/** 开始日志分组 */
export function logGroup(label?: string) {
  if (!level || level === 'off') return
  if (!console || !console.group) return

  console.group(label)
}

/** 结束日志分组 */
export function logGroupEnd() {
  if (!level || level === 'off') return
  if (!console || !console.groupEnd) return

  console.groupEnd()
}

/** 写日志 */
export function log(...args: any[]) {
  if (!level || level === 'off') return
  if (!console || !console[level]) return

  console[level](...args)
}
