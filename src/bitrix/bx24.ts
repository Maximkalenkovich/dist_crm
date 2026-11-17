export interface Bx24PlacementInfo {
  placement: string
  options: Record<string, string>
}

export interface Bx24Api {
  init: (cb: () => void) => void
  callMethod: (
    method: string,
    params: Record<string, unknown>,
    cb: (result: {
      data: () => unknown
      error: () => unknown
      error_description?: string
    }) => void,
  ) => void
  placement: {
    info: () => Bx24PlacementInfo
  }
  getAuth?: () => { access_token?: string; domain?: string }
}

declare global {
  interface Window {
    BX24?: Bx24Api
  }
}

export function isInsideBitrix(): boolean {
  try {
    return window.self !== window.top || Boolean(window.BX24)
  } catch {
    return true
  }
}

export function waitForBx24(timeoutMs = 4000): Promise<Bx24Api | null> {
  return new Promise((resolve) => {
    const started = Date.now()

    const done = (api: Bx24Api | null) => resolve(api)

    const tick = () => {
      if (window.BX24) {
        window.BX24.init(() => done(window.BX24!))
        return
      }
      if (Date.now() - started > timeoutMs) {
        done(null)
        return
      }
      requestAnimationFrame(tick)
    }

    tick()
  })
}

export function callBx24<T = unknown>(
  api: Bx24Api,
  method: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  return new Promise((resolve, reject) => {
    api.callMethod(method, params, (result) => {
      const err = result.error()
      if (err) {
        reject(new Error(String(result.error_description || err)))
        return
      }
      resolve(result.data() as T)
    })
  })
}
