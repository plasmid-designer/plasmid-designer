const PERSIST_KEY = 'plasmid'

const sessionStorageBackend = {
  getData: () => JSON.parse(sessionStorage.getItem(PERSIST_KEY) ?? '{}'),
  setData: data => sessionStorage.setItem(PERSIST_KEY, JSON.stringify(data))
}

const localStorageBackend = {
  getData: () => JSON.parse(localStorage.getItem(PERSIST_KEY) ?? '{}'),
  setData: data => localStorage.setItem(PERSIST_KEY, JSON.stringify(data))
}

const persistSession = (backend, key, { trigger, setSelf, onSet }) => {
  if (trigger === 'get') {
    const sessionData = backend.getData()
    if (key in sessionData) {
      setSelf(sessionData[key])
    }
  }
  onSet((newValue, oldValue, isReset) => {
    const sessionData = backend.getData()
    if (isReset && key in sessionData) {
      delete sessionData[key]
    } else {
      sessionData[key] = newValue
    }
    backend.setData(sessionData)
  })
}

export const persistSessionEffect = key => args => {
  persistSession(sessionStorageBackend, key, args)
}

export const persistLocalEffect = key => args => {
  persistSession(localStorageBackend, key, args)
}
