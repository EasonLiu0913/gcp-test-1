export const localStorage = {
  set: (key, data) => {
    window.localStorage.setItem(key, data)
  },
  setString: (key, data) => {
    window.localStorage.setItem(key, JSON.stringify(data))
  },
  get: (key, defaultVal = null) => {
    return window.localStorage.getItem(key) || defaultVal
  },
  getParse: (key, defaultVal = null) => {
    return jsonParse(window.localStorage.getItem(key), defaultVal)
  },
  remove: (key) => {
    window.localStorage.removeItem(key)
  },
  clear: () => {
    window.localStorage.clear()
  },
}

export const sessionStorage = {
  set: (key, data) => {
    window.sessionStorage.setItem(key, data)
  },
  setString: (key, data) => {
    window.sessionStorage.setItem(key, JSON.stringify(data))
  },
  get: (key, defaultVal = null) => {
    return window.sessionStorage.getItem(key) || defaultVal
  },
  getParse: (key, defaultVal = null) => {
    return jsonParse(window.sessionStorage.getItem(key), defaultVal)
  },
  remove: (key) => {
    window.sessionStorage.removeItem(key)
  },
  clear: () => {
    window.sessionStorage.clear()
  },
}
