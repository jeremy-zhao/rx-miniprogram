
let _promise = new Promise<void>((res) => res())

export function promisify(...fns: Array<Function | undefined>) {

  return function (this: any, ...args: any[]) {
    const self = this

    fns.forEach(fn => {
      if (!fn || !fn.apply) return
      _promise = _promise.then(_ => fn.apply(self, args))
    })

    _promise = _promise.catch(_ => _)
  }
}
