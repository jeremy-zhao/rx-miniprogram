let _promise = new Promise<void>(res => res())

export function promisify(fn?: Function) {
  if (!fn || !fn.apply) return

  return function (this: any, ...args: any[]) {
    const self = this

    _promise = _promise
      .then(() => fn.apply(self, args))
      .catch(err => {
        _promise = new Promise<void>(res => res())
        throw err
      })
  }
}
